// src/components/ui/explorations-with-gsap-and-scroll-trigger.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function NebulaCube({ children }: { children?: React.ReactNode }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const linesRef = useRef<THREE.LineSegments | null>(null);
  const synapseGroupRef = useRef<THREE.Group | null>(null);
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollProgress = useRef(0);

  // Knowledge-graph constants — fewer, clearly clustered nodes
  const NUM_POINTS = 900;
  const NUM_HUBS = 14;
  const positionsArray = useRef<Float32Array | null>(null);
  const initialPositions = useRef<Float32Array | null>(null);
  const speedsArray = useRef<Float32Array | null>(null);

  useEffect(() => {
    const mountElement = mountRef.current;
    if (!mountElement) return;

    // ── 1. Scene ──────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // ── 2. Camera ─────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 10);
    cameraRef.current = camera;

    // ── 3. Renderer ───────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountElement.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const canvas = renderer.domElement;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '1';
    canvas.style.pointerEvents = 'none';
    // Dim so overlaid text stays fully readable
    canvas.style.opacity = '0.42';

    // ── 4. Group ──────────────────────────────────────────────────────────────
    const synapseGroup = new THREE.Group();
    scene.add(synapseGroup);
    synapseGroupRef.current = synapseGroup;

    // ── 5. Knowledge-graph geometry ───────────────────────────────────────────
    // Build hub "concept" centers — denser, brighter anchor nodes
    const hubs: THREE.Vector3[] = [];
    for (let h = 0; h < NUM_HUBS; h++) {
      hubs.push(new THREE.Vector3(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 5,
      ));
    }

    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(NUM_POINTS * 3);
    const originals = new Float32Array(NUM_POINTS * 3);
    const speeds = new Float32Array(NUM_POINTS);
    const colors = new Float32Array(NUM_POINTS * 3);

    const baseColor1 = new THREE.Color('#4B7BF5'); // sapphire
    const baseColor2 = new THREE.Color('#2DD4C8'); // teal
    const baseColor3 = new THREE.Color('#F0B429'); // gold — hubs & cursor highlight

    for (let i = 0; i < NUM_POINTS; i++) {
      const isHub = i < NUM_HUBS;
      const hub = hubs[isHub ? i : Math.floor(Math.random() * NUM_HUBS)];

      // Hub nodes cluster at center; satellites orbit loosely around each hub
      const spread = isHub ? 0 : 1.6 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);

      const x = hub.x + spread * Math.sin(phi) * Math.cos(theta);
      const y = hub.y + spread * Math.sin(phi) * Math.sin(theta) * 0.45;
      const z = hub.z + spread * Math.cos(phi) * 0.6;

      positions[i * 3]     = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originals[i * 3]     = x;
      originals[i * 3 + 1] = y;
      originals[i * 3 + 2] = z;

      // Very slow drift — almost imperceptible
      speeds[i] = 0.12 + Math.random() * 0.28;

      // Hub nodes glow gold; satellites are blue/teal
      const mixedColor = new THREE.Color();
      if (isHub) {
        mixedColor.copy(baseColor3);
      } else {
        const t = Math.random();
        if (t < 0.55) mixedColor.copy(baseColor1).lerp(baseColor2, Math.random() * 0.5);
        else           mixedColor.copy(baseColor2).lerp(baseColor1, Math.random() * 0.4);
      }

      colors[i * 3]     = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    positionsArray.current  = positions;
    initialPositions.current = originals;
    speedsArray.current     = speeds;

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

    // Crisp glow sprite
    const makeGlowTexture = () => {
      const c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      const ctx = c.getContext('2d');
      if (ctx) {
        const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0,    'rgba(255,255,255,1)');
        g.addColorStop(0.2,  'rgba(180,220,255,0.75)');
        g.addColorStop(0.55, 'rgba(60,100,240,0.18)');
        g.addColorStop(1,    'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 64, 64);
      }
      const t = new THREE.Texture(c);
      t.needsUpdate = true;
      return t;
    };

    const pointMaterial = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: makeGlowTexture(),
    });

    const points = new THREE.Points(pointsGeometry, pointMaterial);
    synapseGroup.add(points);
    pointsRef.current = points;

    // 5. Connective Synapses (Lines)
    const connectionsLimit = 650;
    const linePositions = new Float32Array(connectionsLimit * 2 * 3);
    const lineColors = new Float32Array(connectionsLimit * 2 * 3);
    const linesGeometry = new THREE.BufferGeometry();

    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      transparent: true,
      opacity: 0.26,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false,
    });

    const lineSegments = new THREE.LineSegments(linesGeometry, lineMaterial);
    synapseGroup.add(lineSegments);
    linesRef.current = lineSegments;

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    // 6. Scroll — gentle camera depth parallax, no rotation
    ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 3,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
        if (cameraRef.current) {
          cameraRef.current.position.z = lerp(10, 8.2, self.progress);
          cameraRef.current.position.y = lerp(0, -1.0, self.progress);
          cameraRef.current.lookAt(new THREE.Vector3(0, cameraRef.current.position.y * 0.3, 0));
        }
      }
    });

    // 7. Event Listeners
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 8. Animation loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Very slow mouse interpolation
      mouse.current.x = lerp(mouse.current.x, mouse.current.targetX, 0.03);
      mouse.current.y = lerp(mouse.current.y, mouse.current.targetY, 0.03);

      // Gentle 3-D parallax tilt towards cursor — no spin
      if (synapseGroup) {
        synapseGroup.rotation.x = lerp(synapseGroup.rotation.x, mouse.current.y * 0.06, 0.018);
        synapseGroup.rotation.y = lerp(synapseGroup.rotation.y, mouse.current.x * 0.06, 0.018);
      }

      if (positionsArray.current && initialPositions.current && speedsArray.current && pointsRef.current) {
        const pos  = positionsArray.current;
        const init = initialPositions.current;
        const sp   = speedsArray.current;
        const colorsAttr = pointsRef.current.geometry.attributes.color.array as Float32Array;

        const mouseX3D = mouse.current.x * 6;
        const mouseY3D = mouse.current.y * 4;

        let connectionsCount = 0;
        const linesGeo = linesRef.current?.geometry;
        const linePos  = linesGeo?.attributes.position.array as Float32Array;
        const lineCols = linesGeo?.attributes.color.array as Float32Array;

        // Wide connection threshold = denser knowledge-graph topology
        const maxDist2 = 2.6 * 2.6;
        const connectedIndexes: number[] = [];

        for (let i = 0; i < NUM_POINTS; i++) {
          const i3 = i * 3;
          const origX = init[i3];
          const origY = init[i3 + 1];
          const origZ = init[i3 + 2];

          // Very slow, subtle breathing oscillation
          const wavePhase = elapsed * 0.055 * sp[i];
          const xOffset = Math.sin(origX * 0.28 + wavePhase) * 0.12;
          const yOffset = Math.cos(origZ * 0.22 - wavePhase) * 0.08;

          let targetX = origX + xOffset;
          let targetY = origY + yOffset;

          // Mouse cursor: nearby particles glow gold and gently shift
          const dxM = targetX - mouseX3D;
          const dyM = targetY - mouseY3D;
          const distM = Math.sqrt(dxM * dxM + dyM * dyM);

          if (distM < 2.8) {
            const inf = (1.0 - distM / 2.8) * 0.55;
            targetX += dxM * inf * 0.22;
            targetY += dyM * inf * 0.22;
            colorsAttr[i3]     = lerp(colorsAttr[i3],     baseColor3.r * 1.5, inf * 0.12);
            colorsAttr[i3 + 1] = lerp(colorsAttr[i3 + 1], baseColor3.g * 1.5, inf * 0.12);
            colorsAttr[i3 + 2] = lerp(colorsAttr[i3 + 2], baseColor3.b * 1.5, inf * 0.12);
          } else {
            colorsAttr[i3]     = lerp(colorsAttr[i3],     colors[i3],     0.04);
            colorsAttr[i3 + 1] = lerp(colorsAttr[i3 + 1], colors[i3 + 1], 0.04);
            colorsAttr[i3 + 2] = lerp(colorsAttr[i3 + 2], colors[i3 + 2], 0.04);
          }

          pos[i3]     = targetX;
          pos[i3 + 1] = targetY;
          pos[i3 + 2] = origZ;

          // Sample every 4th point for connection building
          if (i % 4 === 0) connectedIndexes.push(i);
        }

        if (linePos && lineCols) {
          for (let k = 0; k < connectedIndexes.length; k++) {
            if (connectionsCount >= connectionsLimit) break;
            const idx1 = connectedIndexes[k];
            const i3 = idx1 * 3;
            const x1 = pos[i3], y1 = pos[i3 + 1], z1 = pos[i3 + 2];

            for (let l = k + 1; l < connectedIndexes.length; l++) {
              if (connectionsCount >= connectionsLimit) break;
              const idx2 = connectedIndexes[l];
              const j3 = idx2 * 3;
              const dx = x1 - pos[j3], dy = y1 - pos[j3 + 1], dz = z1 - pos[j3 + 2];

              if (dx * dx + dy * dy + dz * dz < maxDist2) {
                const lc = connectionsCount * 6;

                linePos[lc]     = x1;       linePos[lc + 1] = y1;        linePos[lc + 2] = z1;
                linePos[lc + 3] = pos[j3];  linePos[lc + 4] = pos[j3+1]; linePos[lc + 5] = pos[j3+2];

                lineCols[lc]     = colorsAttr[i3];     lineCols[lc + 1] = colorsAttr[i3+1]; lineCols[lc + 2] = colorsAttr[i3+2];
                lineCols[lc + 3] = colorsAttr[j3];     lineCols[lc + 4] = colorsAttr[j3+1]; lineCols[lc + 5] = colorsAttr[j3+2];

                connectionsCount++;
              }
            }
          }

          for (let m = connectionsCount; m < connectionsLimit; m++) {
            const lc = m * 6;
            linePos[lc]=linePos[lc+1]=linePos[lc+2]=linePos[lc+3]=linePos[lc+4]=linePos[lc+5]=0;
          }

          if (linesGeo) {
            linesGeo.attributes.position.needsUpdate = true;
            linesGeo.attributes.color.needsUpdate    = true;
          }
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        pointsRef.current.geometry.attributes.color.needsUpdate    = true;
      }

      rendererRef.current?.render(scene, cameraRef.current!);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);

      if (rendererRef.current && mountElement.contains(rendererRef.current.domElement)) {
        mountElement.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }

      sceneRef.current?.traverse((object) => {
        if ((object as THREE.Mesh).geometry) (object as THREE.Mesh).geometry.dispose();
        if ((object as THREE.Mesh).material) {
          const mat = (object as THREE.Mesh).material;
          if (Array.isArray(mat)) mat.forEach(m => m.dispose());
          else (mat as THREE.Material).dispose();
        }
      });
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={mountRef} style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true" />
  );
}

function lerp(start: number, end: number, amt: number): number {
  return start * (1 - amt) + end * amt;
}
