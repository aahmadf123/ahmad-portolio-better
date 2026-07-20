// Shared three.js plumbing: renderer factory, fps-capped frame loop with
// IntersectionObserver + visibilitychange pausing, and full disposal.
// Every canvas in the app goes through this module — no hand-rolled loops.
import * as THREE from 'three';

export interface SceneHost {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** Starts the loop (paused automatically while off-screen / tab hidden). */
  start: () => void;
  /** Stops the loop and releases every GPU resource. */
  dispose: () => void;
  size: { width: number; height: number };
}

export function supportsWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export function createSceneHost(opts: {
  mount: HTMLElement;
  /** Element observed for visibility pausing (defaults to mount). */
  observe?: HTMLElement;
  fov?: number;
  z?: number;
  fpsCap?: number;
  dprMax?: number;
  onFrame: (time: number, dt: number, host: SceneHost) => void;
  onResize?: (host: SceneHost) => void;
}): SceneHost {
  const { mount, fov = 40, z = 14, fpsCap = 30, dprMax = 1.75 } = opts;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 200);
  camera.position.set(0, 0, z);

  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprMax));
  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  const size = { width: 1, height: 1 };
  // host is assigned below before applySize ever runs — guarded for safety.
  const applySize = () => {
    const w = mount.clientWidth || 1;
    const h = mount.clientHeight || 1;
    size.width = w;
    size.height = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (host) opts.onResize?.(host);
  };

  let raf = 0;
  let running = false;
  let visible = true;
  let last = performance.now();
  let acc = 0;
  const frameBudget = 1000 / fpsCap;

  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const dt = now - last;
    last = now;
    acc += dt;
    if (acc < frameBudget) return;
    acc = acc % frameBudget;
    opts.onFrame(now / 1000, dt / 1000, host);
    renderer.render(scene, camera);
  };

  const startLoop = () => {
    if (raf || !running || !visible || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };
  const stopLoop = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) startLoop();
    else stopLoop();
  }, { threshold: 0 });

  const onVis = () => {
    if (document.hidden) stopLoop();
    else startLoop();
  };

  const ro = new ResizeObserver(applySize);

  const host: SceneHost = {
    renderer,
    scene,
    camera,
    size,
    start: () => {
      running = true;
      startLoop();
    },
    dispose: () => {
      running = false;
      stopLoop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => disposeMaterial(m));
        else if (mat) disposeMaterial(mat);
      });
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    },
  };

  io.observe(opts.observe ?? mount);
  document.addEventListener('visibilitychange', onVis);
  ro.observe(mount);
  applySize();

  return host;
}

function disposeMaterial(m: THREE.Material) {
  const anyM = m as THREE.Material & { map?: THREE.Texture | null; uniforms?: Record<string, { value?: unknown }> };
  if (anyM.map) anyM.map.dispose();
  if (anyM.uniforms) {
    for (const u of Object.values(anyM.uniforms)) {
      const v = u?.value;
      if (v instanceof THREE.Texture) v.dispose();
    }
  }
  m.dispose();
}

/** Deterministic PRNG (mulberry32) — stable layouts across renders. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
