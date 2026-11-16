'use client';

import { useEffect, useRef } from 'react';
import { journeyPhoto, worlds, type PhotoId } from '@/lib/data/worlds';
import { activeScene, subscribeScenes, type SceneFrame } from '@/lib/journey/store';

/**
 * Desktop depth renderer: one fixed WebGL2 canvas behind the page that draws the scene
 * that owns the screen, with real parallax from each photo's depth map (near pixels
 * shift more as the mouse moves). Raw WebGL2: one full-screen triangle, one shader.
 *
 * It takes over a photo only once that photo's texture and depth map are loaded: the
 * photo's id goes into <html data-depth-ready>, and CSS hides the matching `.depthable`
 * layers. Any failure (no WebGL2, a texture error, a lost context) clears that list, so
 * the CSS photos simply come back. Panoramas (the Glass Bowl) always stay CSS.
 * Draws only when a scene or the pointer changes; nothing while no scene is on screen.
 */

const PHOTOS: PhotoId[] = ['opening', ...worlds.map((w) => w.photo)];

const VERT = `#version 300 es
in vec2 pos;
out vec2 vUv;
void main() {
  vUv = vec2(pos.x * 0.5 + 0.5, 0.5 - pos.y * 0.5); // top-left origin, like CSS
  gl_Position = vec4(pos, 0.0, 1.0);
}`;

// Same math as the CSS layers: scale about the focal point of the screen box
// (transform-origin), cover-fit with object-position at the focal point; then shift by
// depth for parallax, never more than 1.5% of the frame.
const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 color;
uniform sampler2D uFrom, uFromD, uTo, uToD;
uniform vec4 uCoverFrom, uCoverTo;   // (sx, sy, ox, oy): image uv = o + screen uv * s
uniform vec2 uFocalFrom, uFocalTo;   // focal point, screen uv (top-left origin)
uniform float uFromScale, uToScale, uMix, uHasFrom, uHasTo;
uniform vec2 uPointer;               // -0.5..0.5
vec3 photo(sampler2D img, sampler2D dep, vec4 cover, vec2 focal, float scale) {
  vec2 s = focal + (vUv - focal) / scale;
  vec2 iuv = cover.zw + s * cover.xy;
  float d = texture(dep, iuv).r;
  iuv = clamp(iuv + uPointer * (d - 0.5) * 0.015, 0.001, 0.999);
  return texture(img, iuv).rgb;
}
void main() {
  float a = uHasFrom * (1.0 - uMix);
  float b = uHasTo * uMix;
  vec3 c = vec3(0.0);
  if (a > 0.0) c += photo(uFrom, uFromD, uCoverFrom, uFocalFrom, uFromScale) * a;
  if (b > 0.0) c += photo(uTo, uToD, uCoverTo, uFocalTo, uToScale) * b;
  color = vec4(c, a + b); // premultiplied
}`;

interface Tex { img: WebGLTexture; depth: WebGLTexture; w: number; h: number }

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.decoding = 'async';
    im.onload = () => resolve(im);
    im.onerror = () => reject(new Error(src));
    im.src = src;
  });
}

export default function JourneyCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const html = document.documentElement;
    const keep = new URLSearchParams(location.search).has('testcanvas');
    const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, alpha: true, antialias: false, preserveDrawingBuffer: keep });
    if (!gl) return;

    let dead = false;
    const ready = new Set<PhotoId>();
    const textures = new Map<PhotoId, Tex>();
    const markReady = () => { html.dataset.depthReady = [...ready].join(' '); };
    const fail = () => {
      dead = true;
      ready.clear();
      delete html.dataset.depthReady;
      canvas.style.opacity = '0';
    };

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? 'shader');
      return sh;
    };
    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
    } catch {
      fail();
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    gl.uniform1i(u('uFrom'), 0);
    gl.uniform1i(u('uFromD'), 1);
    gl.uniform1i(u('uTo'), 2);
    gl.uniform1i(u('uToD'), 3);

    const upload = (im: HTMLImageElement) => {
      const t = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    };

    // Load every non-panorama photo (1920w or the largest smaller width) + its depth map.
    const queue = PHOTOS.filter((id) => !journeyPhoto(id).panorama);
    (async () => {
      for (const id of queue) {
        const p = journeyPhoto(id);
        const w = [...p.widths].filter((x) => x <= 1920).pop() ?? p.widths[0];
        try {
          const [im, dm] = await Promise.all([loadImage(p.webp[String(w)]), loadImage(p.depth)]);
          if (dead) return;
          textures.set(id, { img: upload(im), depth: upload(dm), w: im.naturalWidth, h: im.naturalHeight });
          ready.add(id);
          markReady();
          dirty();
        } catch {
          fail(); // one missing asset: give everything back to CSS rather than mix
          return;
        }
      }
    })();

    // Pointer, eased toward the target so the parallax glides.
    const target = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / innerWidth - 0.5;
      target.y = e.clientY / innerHeight - 0.5;
      dirty();
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const resize = () => {
      const dpr = Math.min(1.5, devicePixelRatio || 1);
      canvas.width = Math.round(innerWidth * dpr);
      canvas.height = Math.round(innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      dirty();
    };

    const cover = (t: Tex, id: PhotoId) => {
      const f = journeyPhoto(id).focal;
      const av = innerWidth / innerHeight;
      const ai = t.w / t.h;
      return ai > av ? [av / ai, 1, (1 - av / ai) * f.x, 0] : [1, ai / av, 0, (1 - ai / av) * f.y];
    };

    let frame = 0;
    function dirty() { if (!frame && !dead) frame = requestAnimationFrame(draw); }
    function draw() {
      frame = 0;
      if (dead) return;
      const s: SceneFrame | null = activeScene();
      const from = s?.from && ready.has(s.from) ? textures.get(s.from) : undefined;
      const to = s && ready.has(s.to) ? textures.get(s.to) : undefined;
      if (!s || (!from && !to)) { canvas.style.opacity = '0'; return; }
      canvas.style.opacity = '1';
      pointer.x += (target.x - pointer.x) * 0.12;
      pointer.y += (target.y - pointer.y) * 0.12;
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.uniform2f(u('uPointer'), pointer.x, pointer.y);
      gl!.uniform1f(u('uMix'), s.mix);
      gl!.uniform1f(u('uHasFrom'), from ? 1 : 0);
      gl!.uniform1f(u('uHasTo'), to ? 1 : 0);
      if (from && s.from) {
        const f = journeyPhoto(s.from).focal;
        gl!.activeTexture(gl!.TEXTURE0); gl!.bindTexture(gl!.TEXTURE_2D, from.img);
        gl!.activeTexture(gl!.TEXTURE1); gl!.bindTexture(gl!.TEXTURE_2D, from.depth);
        gl!.uniform4fv(u('uCoverFrom'), cover(from, s.from));
        gl!.uniform2f(u('uFocalFrom'), f.x, f.y);
        gl!.uniform1f(u('uFromScale'), s.fromScale);
      }
      if (to) {
        const f = journeyPhoto(s.to).focal;
        gl!.activeTexture(gl!.TEXTURE2); gl!.bindTexture(gl!.TEXTURE_2D, to.img);
        gl!.activeTexture(gl!.TEXTURE3); gl!.bindTexture(gl!.TEXTURE_2D, to.depth);
        gl!.uniform4fv(u('uCoverTo'), cover(to, s.to));
        gl!.uniform2f(u('uFocalTo'), f.x, f.y);
        gl!.uniform1f(u('uToScale'), s.toScale);
      }
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      if (Math.abs(target.x - pointer.x) > 0.0005 || Math.abs(target.y - pointer.y) > 0.0005) dirty();
    }

    const unsub = subscribeScenes(dirty);
    const onLost = (e: Event) => { e.preventDefault(); fail(); };
    canvas.addEventListener('webglcontextlost', onLost);
    window.addEventListener('resize', resize);
    resize();

    return () => {
      dead = true;
      unsub();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('webglcontextlost', onLost);
      delete html.dataset.depthReady;
      textures.forEach((t) => { gl.deleteTexture(t.img); gl.deleteTexture(t.depth); });
    };
  }, []);

  return (
    <>
      <canvas
        ref={ref}
        data-journey-canvas=""
        aria-hidden
        style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 1, pointerEvents: 'none', opacity: 0 }}
      />
      <style>{PHOTOS.map((id) => `html[data-depth-ready~="${id}"] .flyin-photo.depthable[data-photo="${id}"] { visibility: hidden; }`).join('\n')}</style>
    </>
  );
}
