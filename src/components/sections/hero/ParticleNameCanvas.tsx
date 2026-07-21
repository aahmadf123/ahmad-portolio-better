'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from '@/lib/motion/gsap';
import { createSceneHost, seededRandom, supportsWebGL } from '@/lib/three/scene-kit';
import { sampleTextPoints } from '@/lib/three/text-sampling';

const VERT = /* glsl */ `
  attribute vec3 aStart;
  attribute vec2 aTarget;
  attribute float aDelay;
  attribute float aSeed;
  attribute float aGold;
  attribute vec3 aAmbient;
  uniform float uProgress;
  uniform float uDisperse;
  uniform float uTime;
  uniform float uSize;
  uniform float uScale;
  uniform vec2 uOffset;
  varying float vSeed;
  varying float vGold;
  varying float vAlpha;

  void main() {
    float t = clamp((uProgress * 1.3 - aDelay * 0.3) / 1.0, 0.0, 1.0);
    t = 1.0 - pow(1.0 - t, 3.0);
    vec3 formed = vec3(aTarget * uScale + uOffset, 0.0);
    // idle shimmer once formed
    formed.xy += vec2(
      sin(uTime * 0.6 + aSeed * 43.0),
      cos(uTime * 0.5 + aSeed * 91.0)
    ) * 0.012 * t;
    vec3 p = mix(aStart, formed, t);
    p = mix(p, aAmbient, uDisperse);
    p.xy += vec2(
      sin(uTime * 0.22 + aSeed * 17.0),
      cos(uTime * 0.19 + aSeed * 23.0)
    ) * 0.35 * uDisperse;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float twinkle = 0.75 + 0.25 * sin(uTime * (1.5 + aSeed) + aSeed * 40.0);
    gl_PointSize = uSize * (1.0 + aGold * 0.5) * twinkle * (14.0 / -mv.z) * mix(1.0, 1.4, uDisperse);
    gl_Position = projectionMatrix * mv;

    vSeed = aSeed;
    vGold = aGold;
    vAlpha = mix(0.9, 0.3, uDisperse) * twinkle;
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  varying float vSeed;
  varying float vGold;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float a = smoothstep(0.5, 0.16, d) * vAlpha * 0.85;
    if (a < 0.02) discard;
    vec3 teal = vec3(0.176, 0.831, 0.749);
    vec3 cream = vec3(0.957, 0.957, 0.949);
    vec3 gold = vec3(0.961, 0.620, 0.043);
    vec3 col = mix(teal, cream, smoothstep(0.25, 0.9, vSeed));
    col = mix(col, gold, vGold);
    gl_FragColor = vec4(col, a);
  }
`;

export interface ParticleNameHandle {
  skip: () => void;
}

/**
 * The hero title sequence: ~3–4k GPU particles converge from a scattered
 * sphere into the name glyph (aligned to the DOM h1), then disperse into an
 * ambient drift cloud once the DOM text solidifies. All motion is shader-side;
 * JS writes uniforms only.
 */
export const ParticleNameCanvas = React.forwardRef<ParticleNameHandle, {
  titleRef: React.RefObject<HTMLElement | null>;
  /** Jump straight to the ambient end state (intro already seen). */
  instant?: boolean;
  onFormed?: () => void;
  onSettled?: () => void;
}>(function ParticleNameCanvas({ titleRef, instant = false, onFormed, onSettled }, ref) {
  const mountRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => {});

  React.useImperativeHandle(ref, () => ({ skip: () => skipRef.current() }), []);

  useEffect(() => {
    const mount = mountRef.current;
    const title = titleRef.current;
    if (!mount || !title || !supportsWebGL()) {
      // No canvas possible — degrade to the static hero immediately.
      onFormed?.();
      onSettled?.();
      return;
    }

    let disposed = false;
    let host: ReturnType<typeof createSceneHost> | null = null;
    const tweens: gsap.core.Tween[] = [];

    const boot = async () => {
      try {
        await document.fonts.ready;
      } catch { /* fonts API unavailable — proceed */ }
      if (disposed) return;

      const fontFamily = getComputedStyle(title).fontFamily || 'Georgia, serif';
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isCoarse = window.matchMedia('(pointer: coarse)').matches;
      const isLowPower = 'deviceMemory' in navigator && (navigator as { deviceMemory?: number }).deviceMemory != null && (navigator as { deviceMemory?: number }).deviceMemory! < 4;
      const isMobile = isCoarse || window.innerWidth < 768;

      // Degrade to a static hero on reduced motion, touch-only devices, or low-memory hardware.
      if (isReduced || (isCoarse && isLowPower)) {
        onFormed?.();
        onSettled?.();
        return;
      }

      let stride = 4;
      // Reduce density on phones/tablets to keep the GPU budget small.
      if (isCoarse || window.innerWidth < 768 || isLowPower) stride = 8;
      let sampled = sampleTextPoints({ lines: ['Ahmad', 'Firas'], fontFamily, stride });
      if (sampled.count > (isMobile ? 2400 : 4600)) sampled = sampleTextPoints({ lines: ['Ahmad', 'Firas'], fontFamily, stride: (stride = isMobile ? 8 : 6) });
      else if (sampled.count < (isMobile ? 800 : 1600)) sampled = sampleTextPoints({ lines: ['Ahmad', 'Firas'], fontFamily, stride: (stride = isMobile ? 5 : 3) });
      const N = sampled.count;
      if (N === 0) return;

      const rand = seededRandom(20260720);
      // Cap DPR on mobile so the fragment shader stays cheap.
      const dprMax = isCoarse ? 1 : 1.75;
      const uniforms = {
        uProgress: { value: instant ? 1 : 0 },
        uDisperse: { value: instant ? 1 : 0 },
        uTime: { value: 0 },
        uSize: { value: 2.6 * Math.min(window.devicePixelRatio || 1, dprMax) },
        uScale: { value: 1 },
        uOffset: { value: new THREE.Vector2(0, 0) },
      };

      const geo = new THREE.BufferGeometry();
      const starts = new Float32Array(N * 3);
      const targets = new Float32Array(N * 2);
      const ambient = new Float32Array(N * 3);
      const delays = new Float32Array(N);
      const seeds = new Float32Array(N);
      const golds = new Float32Array(N);

      // normalized target x-range for left-to-right stagger
      let minX = Infinity, maxX = -Infinity;
      for (let i = 0; i < N; i++) {
        const x = sampled.points[i * 2];
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }

      for (let i = 0; i < N; i++) {
        const tx = sampled.points[i * 2];
        const ty = sampled.points[i * 2 + 1];
        targets[i * 2] = tx;
        targets[i * 2 + 1] = ty;

        // scattered start: shell around the viewport
        const r = 9 + rand() * 7;
        const theta = rand() * Math.PI * 2;
        const phi = Math.acos(2 * rand() - 1);
        starts[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        starts[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
        starts[i * 3 + 2] = r * Math.cos(phi) * 0.5 - 2;

        // ambient cloud: loose expansion of the glyph + drift depth
        ambient[i * 3] = tx * 3.2 + (rand() - 0.5) * 9;
        ambient[i * 3 + 1] = ty * 3.2 + (rand() - 0.5) * 6;
        ambient[i * 3 + 2] = -1.5 - rand() * 4;

        delays[i] = ((tx - minX) / Math.max(0.0001, maxX - minX)) * 0.8 + rand() * 0.2;
        seeds[i] = rand();
        golds[i] = rand() < 0.08 ? 1 : 0;
      }

      geo.setAttribute('aStart', new THREE.BufferAttribute(starts, 3));
      geo.setAttribute('position', new THREE.BufferAttribute(starts.slice(), 3));
      geo.setAttribute('aTarget', new THREE.BufferAttribute(targets, 2));
      geo.setAttribute('aAmbient', new THREE.BufferAttribute(ambient, 3));
      geo.setAttribute('aDelay', new THREE.BufferAttribute(delays, 1));
      geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
      geo.setAttribute('aGold', new THREE.BufferAttribute(golds, 1));

      const mat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(geo, mat);
      points.frustumCulled = false;

      // ambient wireframe drifters
      const wireMat = new THREE.LineBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.1 });
      const wireMat2 = new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.07 });
      const ico = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.1, 0)), wireMat);
      ico.position.set(-7.5, -2.5, -6);
      const sph = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(1.5, 10, 8)), wireMat2);
      sph.position.set(7.5, 3, -7);
      const tet = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.TetrahedronGeometry(1.0, 0)), wireMat);
      tet.position.set(5.5, -3.5, -5);

      const group = new THREE.Group();
      group.add(points, ico, sph, tet);

      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      const onMouse = (e: MouseEvent) => {
        mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      if (!isCoarse) {
        window.addEventListener('mousemove', onMouse, { passive: true });
      }

      // Fit the glyph to the DOM h1 rect (world units at z=0 plane).
      // Declared before createSceneHost — onResize fires during construction.
      const fit = (h: ReturnType<typeof createSceneHost>) => {
        const rect = title.getBoundingClientRect();
        const mountRect = mount.getBoundingClientRect();
        const worldH = 2 * h.camera.position.z * Math.tan((h.camera.fov * Math.PI) / 360);
        const worldPerPx = worldH / Math.max(1, h.size.height);
        uniforms.uScale.value = (rect.height * worldPerPx) / 2;
        const cx = rect.left + rect.width / 2 - (mountRect.left + mountRect.width / 2);
        const cy = rect.top + rect.height / 2 - (mountRect.top + mountRect.height / 2);
        uniforms.uOffset.value.set(cx * worldPerPx, -cy * worldPerPx);
      };

      host = createSceneHost({
        mount,
        fov: 40,
        z: 14,
        fpsCap: isCoarse ? 24 : 30,
        dprMax,
        onFrame: (t) => {
          uniforms.uTime.value = t;
          mouse.x += (mouse.tx - mouse.x) * 0.03;
          mouse.y += (mouse.ty - mouse.y) * 0.03;
          const amt = 0.25 + 0.75 * uniforms.uDisperse.value;
          group.rotation.y = mouse.x * 0.05 * amt;
          group.rotation.x = -mouse.y * 0.035 * amt;
          ico.rotation.x = t * 0.08;
          ico.rotation.y = t * 0.11;
          sph.rotation.y = -t * 0.07;
          tet.rotation.x = -t * 0.09;
          tet.rotation.z = t * 0.06;
        },
        onResize: (h) => fit(h),
      });
      host.scene.add(group);
      fit(host);
      host.start();

      let settled = instant;
      const disperse = () => {
        tweens.push(
          gsap.to(uniforms.uDisperse, {
            value: 1,
            duration: 1.6,
            ease: 'power2.inOut',
            onComplete: () => {
              settled = true;
              onSettled?.();
            },
          })
        );
      };

      if (!instant) {
        tweens.push(
          gsap.to(uniforms.uProgress, {
            value: 1,
            duration: 2.8,
            ease: 'expo.out',
            onComplete: () => {
              onFormed?.();
              tweens.push(gsap.delayedCall(0.55, disperse) as unknown as gsap.core.Tween);
            },
          })
        );
      } else {
        onFormed?.();
        onSettled?.();
      }

      skipRef.current = () => {
        if (settled) return;
        tweens.forEach((tw) => tw.kill());
        tweens.length = 0;
        tweens.push(gsap.to(uniforms.uProgress, { value: 1, duration: 0.35, ease: 'power2.out' }));
        onFormed?.();
        tweens.push(
          gsap.to(uniforms.uDisperse, {
            value: 1,
            duration: 0.8,
            delay: 0.25,
            ease: 'power2.inOut',
            onComplete: () => {
              settled = true;
              onSettled?.();
            },
          })
        );
      };

      cleanupExtras = () => {
        window.removeEventListener('mousemove', onMouse);
      };
    };

    let cleanupExtras = () => {};
    boot().catch(() => {
      // Any boot failure degrades to the static hero rather than a stuck intro.
      onFormed?.();
      onSettled?.();
    });

    return () => {
      disposed = true;
      tweens.forEach((tw) => tw.kill());
      cleanupExtras();
      host?.dispose();
      host = null;
    };
  }, [titleRef, instant, onFormed, onSettled]);

  return <div ref={mountRef} aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />;
});
