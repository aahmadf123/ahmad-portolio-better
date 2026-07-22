'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createSceneHost, seededRandom, supportsWebGL, type SceneHost } from '@/lib/three/scene-kit';
import { constellation, skillGroups, type SkillNode } from '@/lib/data/skills';
import { MONO } from '@/components/shared/section-helpers';

// ── Tunables ──────────────────────────────────────────────────────────────────
const ZOOM_STEPS = [1, 1.35, 1.8];
const TOP_LABELS = 20;            // LOD: how many highest-weight names always show
const LABEL_OFFSET = 14;          // flat px below a star (approximation, not radius-scaled)
const LABEL_FILL = 'rgba(244,244,242,0.78)';
const DIM = 0.78;                 // lerp toward --surface for de-emphasised clusters
const DIM_SCALE = 0.8;

interface LayoutNode extends SkillNode {
  x: number;
  y: number;
  z: number;
  color: string;
  radius: number;
  ring: number;      // 0 = innermost; used by the intro-assembly stagger
  idxInRing: number; // 0..6 position within the ring
}

interface Tooltip {
  x: number;
  y: number;
  name: string;
  group: string;
  color: string;
}

interface HubInfo {
  id: string;
  label: string;
  color: string;
  hubX: number;
  hubY: number;
  anchorX: number;
  anchorY: number;
}

// ── Layout ──────────────────────────────────────────────────────────────────
/** Deterministic radial-cluster layout: 7 group hubs on an ellipse, skills in rings. */
function computeLayout(): LayoutNode[] {
  const rand = seededRandom(41683);
  const byGroup = new Map(skillGroups.map((g) => [g.id, g]));
  const out: LayoutNode[] = [];
  skillGroups.forEach((group, gi) => {
    const angle = (gi / skillGroups.length) * Math.PI * 2 - Math.PI / 2;
    const hx = Math.cos(angle) * 6.6;
    const hy = Math.sin(angle) * 3.6;
    const nodes = constellation.nodes.filter((n) => n.group === group.id);
    nodes
      .slice()
      .sort((a, b) => b.weight - a.weight)
      .forEach((n, i) => {
        const ring = Math.floor(i / 7);
        const idxInRing = i % 7;
        const rr = 0.55 + ring * 0.62 + rand() * 0.18;
        const aa = (idxInRing / 7) * Math.PI * 2 + ring * 0.45 + rand() * 0.35;
        out.push({
          ...n,
          x: hx + Math.cos(aa) * rr * 1.25,
          y: hy + Math.sin(aa) * rr * 0.8,
          z: (rand() - 0.5) * 1.2,
          color: byGroup.get(group.id)!.color,
          radius: 0.075 + Math.min(0.11, n.weight * 0.022),
          ring,
          idxInRing,
        });
      });
  });
  return out;
}

/** Hub anchors share the layout's hub-angle formula so labels can't drift off-cluster. */
function computeHubs(): HubInfo[] {
  return skillGroups.map((g, gi) => {
    const angle = (gi / skillGroups.length) * Math.PI * 2 - Math.PI / 2;
    return {
      id: g.id,
      label: g.label,
      color: g.color,
      hubX: Math.cos(angle) * 6.6,
      hubY: Math.sin(angle) * 3.6,
      anchorX: Math.cos(angle) * 6.6,
      anchorY: Math.sin(angle) * 3.6 + 1.35,
    };
  });
}

/** GLSL-style smoothstep - eases the intro-assembly edge/label fade-in. */
function smoothstep(a: number, b: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/** '#RRGGBB' → 'rgba(r,g,b,a)' for canvas fills that need a specific alpha. */
function hexA(hex: string, a: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/**
 * Interactive 3D skill constellation - the full skill inventory (currently 88)
 * as instanced nodes clustered by group, connected by co-occurrence edges. A 2D
 * label overlay tracks the rotating clusters every frame (hub names + the top-
 * weight stars); the legend isolates a cluster with a damped camera push-in.
 * Idle 30fps, IO-paused, fully disposed on unmount.
 */
export function ConstellationCanvas({
  focusGroup,
  onSelect,
}: {
  focusGroup: string | null;
  onSelect: (node: SkillNode | null) => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLCanvasElement>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [zoomIdx, setZoomIdx] = useState(0);

  // Dynamic inputs cross into the (stable) scene effect through refs only - the
  // scene is NEVER rebuilt on focus/zoom change.
  const focusRef = useRef<string | null>(focusGroup);
  const zoomRef = useRef<number>(ZOOM_STEPS[0]);
  const applyFocusRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !supportsWebGL()) return;

    const labelCanvas = labelRef.current;
    const ctx = labelCanvas ? labelCanvas.getContext('2d') : null;

    // ── Scene build ────────────────────────────────────────────────────────
    const layout = computeLayout();
    const byName = new Map(layout.map((n) => [n.name, n]));
    const hubs = computeHubs();
    const hubById = new Map(hubs.map((h) => [h.id, h]));

    // LOD: indices of the highest-weight nodes, always labelled when unfocused.
    const topIdx = layout
      .map((n, i) => ({ i, w: n.weight }))
      .sort((a, b) => b.w - a.w)
      .slice(0, TOP_LABELS)
      .map((e) => e.i);

    const geo = new THREE.CircleGeometry(1, 20);
    const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.95 });
    const mesh = new THREE.InstancedMesh(geo, mat, layout.length);
    const dummy = new THREE.Object3D();
    const tmpColor = new THREE.Color();
    const DARK = new THREE.Color('#13151b');
    layout.forEach((n, i) => {
      dummy.position.set(n.x, n.y, n.z);
      dummy.scale.setScalar(n.radius);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, tmpColor.set(n.color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    // halo ring per node (soft glow illusion via larger translucent circle)
    const haloMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.14 });
    const halo = new THREE.InstancedMesh(geo, haloMat, layout.length);
    layout.forEach((n, i) => {
      dummy.position.set(n.x, n.y, n.z - 0.01);
      dummy.scale.setScalar(n.radius * 2.4);
      dummy.updateMatrix();
      halo.setMatrixAt(i, dummy.matrix);
      halo.setColorAt(i, tmpColor.set(n.color));
    });

    // Resolve every edge to its two layout nodes once; every edge now has
    // strength ≥ 1, so there is nothing to threshold out.
    const edgeList: [LayoutNode, LayoutNode][] = [];
    constellation.edges.forEach((e) => {
      const a = byName.get(e.a);
      const b = byName.get(e.b);
      if (a && b) edgeList.push([a, b]);
    });

    // edgesBase - all edges (the ambient web); edgesFocus - only the focused
    // cluster's internal edges, brighter, rebuilt on focus.
    const basePos: number[] = [];
    for (const [a, b] of edgeList) basePos.push(a.x, a.y, a.z, b.x, b.y, b.z);
    const baseGeo = new THREE.BufferGeometry();
    baseGeo.setAttribute('position', new THREE.Float32BufferAttribute(basePos, 3));
    const edgesBase = new THREE.LineSegments(
      baseGeo,
      new THREE.LineBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending })
    );

    const focusGeo = new THREE.BufferGeometry();
    focusGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(0), 3));
    const edgesFocus = new THREE.LineSegments(
      focusGeo,
      new THREE.LineBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending })
    );
    edgesFocus.frustumCulled = false;

    // hover highlight edges (unchanged white flash of a node's connections)
    const hlGeo = new THREE.BufferGeometry();
    hlGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(0), 3));
    const hlLines = new THREE.LineSegments(
      hlGeo,
      new THREE.LineBasicMaterial({ color: 0xf4f4f2, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending })
    );

    const group = new THREE.Group();
    group.add(halo, mesh, edgesBase, edgesFocus, hlLines);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hovered = -1;

    // Damped-camera state (targets written by applyFocus / click, eased in onFrame).
    const camTarget = { x: 0, y: 0, z: 11 / zoomRef.current };
    const camVec = new THREE.Vector3();
    const projVec = new THREE.Vector3();
    let prevT = 0;

    // ── Intro assembly (one-shot: stars stream out from their group hub) ─────
    // Matrix-ownership contract: while q<1 the intro OWNS every instance matrix -
    // applyFocus() may recolor but must NOT rewrite matrices, and hover scale-up
    // is suppressed (tooltip still shows). At q>=1 we write the final seat
    // matrices once, then reconcile focus/zoom exactly once, and never touch
    // matrices from the intro path again. Reduced motion jumps straight to q=1.
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let introT0 = -1;
    let introDone = prefersReducedMotion;
    let introAlpha = prefersReducedMotion ? 1 : 0; // edge + label fade-in multiplier
    const introHub = layout.map((n) => hubById.get(n.group)!);
    const introStagger = layout.map((n) => n.idxInRing * 0.05 + n.ring * 0.08);

    // ── Label overlay ──────────────────────────────────────────────────────
    const monoFamily =
      (typeof getComputedStyle !== 'undefined'
        ? getComputedStyle(document.body).getPropertyValue('--font-code').trim()
        : '') || "'JetBrains Mono', monospace";
    const LABEL_FONT = `10px ${monoFamily}`;
    const widthCache = new Map<string, number>();

    interface LabelEntry { name: string; sx: number; sy: number; weight: number; color: string; focusMember: boolean; }
    interface PlacedLabel { x0: number; x1: number; y: number; name: string; sx: number; weight: number; color: string; focusMember: boolean; }

    const drawLabels = (h: SceneHost) => {
      if (!ctx) return;
      const w = h.size.width;
      const hh = h.size.height;
      ctx.clearRect(0, 0, w, hh);
      group.updateMatrixWorld();
      const focus = focusRef.current;

      ctx.font = LABEL_FONT;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 4;
      ctx.globalAlpha = introAlpha; // labels fade in as the assembly lands (1 when settled)

      // Hub labels - projected through the SAME world matrix as the stars, so
      // they ride the rotating clusters instead of drifting.
      for (const hub of hubs) {
        if (focus && hub.id !== focus) continue;
        projVec.set(hub.anchorX, hub.anchorY, 0).applyMatrix4(group.matrixWorld).project(h.camera);
        if (projVec.z > 1) continue;
        const hx = ((projVec.x + 1) / 2) * w;
        // Horizontal tracks freely (the axis parallax rotates most); vertical is
        // clamped into the frame so a top cluster's label pins to the edge above
        // it rather than clipping away entirely.
        const hy = Math.max(13, Math.min(hh - 8, ((1 - projVec.y) / 2) * hh));
        ctx.fillStyle = hexA(hub.color, 0.9);
        ctx.fillText(hub.label.toUpperCase(), hx, hy);
      }

      // Which stars get a name this frame (LOD set).
      const entries: LabelEntry[] = [];
      const seen = new Set<number>();
      const consider = (idx: number) => {
        if (idx < 0 || seen.has(idx)) return;
        seen.add(idx);
        const n = layout[idx];
        projVec.set(n.x, n.y, n.z).applyMatrix4(group.matrixWorld).project(h.camera);
        if (projVec.z > 1) return;
        entries.push({
          name: n.name,
          sx: ((projVec.x + 1) / 2) * w,
          sy: ((1 - projVec.y) / 2) * hh,
          weight: n.weight,
          color: n.color,
          focusMember: !!focus && n.group === focus,
        });
      };
      if (focus) {
        for (let i = 0; i < layout.length; i++) if (layout[i].group === focus) consider(i);
      } else {
        for (const i of topIdx) consider(i);
      }
      if (hovered >= 0) consider(hovered);

      // Collision: top-to-bottom greedy placement, up to two 12px nudges, then
      // the lighter-weight label yields.
      entries.sort((a, b) => a.sy - b.sy);
      const placed: PlacedLabel[] = [];
      for (const e of entries) {
        let width = widthCache.get(e.name);
        if (width === undefined) {
          width = ctx.measureText(e.name).width;
          widthCache.set(e.name, width);
        }
        const x0 = e.sx - width / 2;
        const x1 = e.sx + width / 2;
        let y = e.sy + LABEL_OFFSET;
        const hitsAt = (yy: number) => placed.filter((p) => Math.abs(p.y - yy) < 12 && x0 < p.x1 && x1 > p.x0);
        let colls = hitsAt(y);
        let nudges = 0;
        while (colls.length && nudges < 2) {
          y += 12;
          colls = hitsAt(y);
          nudges++;
        }
        if (colls.length) {
          if (colls.some((p) => p.weight >= e.weight)) continue; // heavier one wins → drop current
          for (const c of colls) {
            const k = placed.indexOf(c);
            if (k >= 0) placed.splice(k, 1);
          }
        }
        placed.push({ x0, x1, y, name: e.name, sx: e.sx, weight: e.weight, color: e.color, focusMember: e.focusMember });
      }
      for (const p of placed) {
        ctx.fillStyle = p.focusMember ? p.color : LABEL_FILL;
        ctx.fillText(p.name, p.sx, p.y);
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    // ── Focus / zoom (ref-driven; no scene rebuild) ────────────────────────
    const applyFocus = () => {
      const focus = focusRef.current;
      const zoom = zoomRef.current;

      for (let i = 0; i < layout.length; i++) {
        const n = layout[i];
        const dim = focus !== null && n.group !== focus;
        tmpColor.set(n.color);
        if (dim) tmpColor.lerp(DARK, DIM);
        mesh.setColorAt(i, tmpColor);
        halo.setColorAt(i, tmpColor);
        // Matrix-ownership: during the intro the assembly owns matrices; recolor
        // only. Scales resume once the stars have landed (introDone).
        if (introDone && i !== hovered) {
          const s = dim ? DIM_SCALE : 1;
          dummy.position.set(n.x, n.y, n.z);
          dummy.scale.setScalar(n.radius * s);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
          dummy.position.set(n.x, n.y, n.z - 0.01);
          dummy.scale.setScalar(n.radius * 2.4 * s);
          dummy.updateMatrix();
          halo.setMatrixAt(i, dummy.matrix);
        }
      }
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      if (halo.instanceColor) halo.instanceColor.needsUpdate = true;
      if (introDone) {
        mesh.instanceMatrix.needsUpdate = true;
        halo.instanceMatrix.needsUpdate = true;
      }

      const baseMatMat = edgesBase.material as THREE.LineBasicMaterial;
      const focusMatMat = edgesFocus.material as THREE.LineBasicMaterial;
      if (focus) {
        const pos: number[] = [];
        for (const [a, b] of edgeList) {
          if (a.group === focus && b.group === focus) {
            pos.push(a.x, a.y, a.z + 0.01, b.x, b.y, b.z + 0.01);
          }
        }
        edgesFocus.geometry.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        edgesFocus.geometry.attributes.position.needsUpdate = true;
        focusMatMat.color.set(hubById.get(focus)?.color ?? '#2dd4bf');
        baseMatMat.opacity = 0.08;
      } else {
        edgesFocus.geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(0), 3));
        edgesFocus.geometry.attributes.position.needsUpdate = true;
        baseMatMat.opacity = 0.28;
      }

      if (focus) {
        const hub = hubById.get(focus)!;
        camTarget.x = hub.hubX * 0.55;
        camTarget.y = hub.hubY * 0.55;
        camTarget.z = 8.2 / zoom;
      } else {
        camTarget.x = 0;
        camTarget.y = 0;
        camTarget.z = 11 / zoom;
      }
    };

    // ── Host + frame loop ──────────────────────────────────────────────────
    const host = createSceneHost({
      mount,
      fov: 40,
      z: 11,
      fpsCap: 30,
      onFrame: (t, _dt, h) => {
        const dt = prevT ? Math.min(t - prevT, 0.1) : 0.033;
        prevT = t;

        // ── One-shot assembly: each star streams from its group hub to its seat.
        if (!introDone) {
          if (introT0 < 0) introT0 = t; // captured on the first visible frame
          const q = Math.min(1, Math.max(0, (t - introT0) / 1.1));
          const e = 1 - Math.pow(1 - q, 4); // easeOutQuart
          for (let i = 0; i < layout.length; i++) {
            const n = layout[i];
            const hub = introHub[i];
            const p = Math.min(1, Math.max(0, e * 1.3 - introStagger[i]));
            const lx = hub.hubX + (n.x - hub.hubX) * p;
            const ly = hub.hubY + (n.y - hub.hubY) * p;
            const lz = n.z * p; // hub sits at z=0
            dummy.position.set(lx, ly, lz);
            dummy.scale.setScalar(n.radius);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
            dummy.position.set(lx, ly, lz - 0.01);
            dummy.scale.setScalar(n.radius * 2.4);
            dummy.updateMatrix();
            halo.setMatrixAt(i, dummy.matrix);
          }
          mesh.instanceMatrix.needsUpdate = true;
          halo.instanceMatrix.needsUpdate = true;
          introAlpha = smoothstep(0.6, 1, q);
          // edges fade in as the stars land (focus-aware base, overridden by applyFocus once done)
          (edgesBase.material as THREE.LineBasicMaterial).opacity = (focusRef.current ? 0.08 : 0.28) * introAlpha;

          if (q >= 1) {
            introDone = true;
            // write the final seat matrices once…
            for (let i = 0; i < layout.length; i++) {
              const n = layout[i];
              dummy.position.set(n.x, n.y, n.z);
              dummy.scale.setScalar(n.radius);
              dummy.updateMatrix();
              mesh.setMatrixAt(i, dummy.matrix);
              dummy.position.set(n.x, n.y, n.z - 0.01);
              dummy.scale.setScalar(n.radius * 2.4);
              dummy.updateMatrix();
              halo.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
            halo.instanceMatrix.needsUpdate = true;
            introAlpha = 1;
            // …then reconcile any focus/zoom picked mid-intro, exactly once.
            applyFocusRef.current?.();
            // if the pointer was resting on a star, restore its enlarged state.
            if (hovered >= 0) {
              const n = layout[hovered];
              dummy.position.set(n.x, n.y, n.z + 0.05);
              dummy.scale.setScalar(n.radius * 1.7);
              dummy.updateMatrix();
              mesh.setMatrixAt(hovered, dummy.matrix);
              mesh.instanceMatrix.needsUpdate = true;
            }
          }
        }

        const focused = focusRef.current !== null;

        mouse.x += (mouse.tx - mouse.x) * 0.05;
        mouse.y += (mouse.ty - mouse.y) * 0.05;
        const amp = focused ? 0.35 : 1;
        group.rotation.y = mouse.x * 0.1 * amp;
        group.rotation.x = -mouse.y * 0.07 * amp;

        const k = 1 - Math.exp(-4 * dt);
        const rzTarget = focused ? 0 : Math.sin(t * 0.1) * 0.015;
        group.rotation.z += (rzTarget - group.rotation.z) * k;

        camVec.set(camTarget.x, camTarget.y, camTarget.z);
        h.camera.position.lerp(camVec, k);
        h.camera.updateMatrixWorld(); // keep matrixWorldInverse fresh so labels don't lag a frame

        drawLabels(h);
      },
      onResize: (h) => {
        // Mirror scene-kit's clamped DPR onto the label canvas without touching
        // scene-kit: read it back off the WebGL canvas it created.
        if (!labelCanvas || !ctx) return;
        const glCanvas = mount.querySelector('canvas:not([data-labels])') as HTMLCanvasElement | null;
        const cssW = (glCanvas?.clientWidth || h.size.width) || 1;
        const cssH = (glCanvas?.clientHeight || h.size.height) || 1;
        const dpr = glCanvas && glCanvas.clientWidth ? glCanvas.width / glCanvas.clientWidth : window.devicePixelRatio || 1;
        labelCanvas.width = Math.round(cssW * dpr);
        labelCanvas.height = Math.round(cssH * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      },
    });
    host.scene.add(group);

    // Register the bridge and apply the current (ref) focus/zoom so a rebuild
    // restores state; then start the loop.
    applyFocusRef.current = applyFocus;
    applyFocus();
    host.start();

    // ── Picking + tooltip ──────────────────────────────────────────────────
    const makeTooltip = (n: LayoutNode, clientX: number, clientY: number): Tooltip => {
      const rect = mount.getBoundingClientRect();
      return {
        // clamp inside the canvas so the tooltip never reads layout during render
        x: Math.min(clientX - rect.left + 14, rect.width - 160),
        y: clientY - rect.top - 12,
        name: n.name,
        group: skillGroups.find((g) => g.id === n.group)?.label ?? n.group,
        color: n.color,
      };
    };

    const setHover = (idx: number, clientX: number, clientY: number) => {
      if (idx === hovered) {
        if (idx >= 0) setTooltip(makeTooltip(layout[idx], clientX, clientY));
        return;
      }
      // While the intro owns matrices, only the tooltip/cursor track the pointer -
      // no scale-up, no edge highlight. hovered is still recorded so the finalize
      // can restore the enlarged state if the pointer is resting on a star.
      if (!introDone) {
        hovered = idx;
        if (idx >= 0) {
          setTooltip(makeTooltip(layout[idx], clientX, clientY));
          mount.style.cursor = 'pointer';
        } else {
          setTooltip(null);
          mount.style.cursor = '';
        }
        return;
      }
      // restore previous at its focus-aware scale
      if (hovered >= 0) {
        const p = layout[hovered];
        const dim = focusRef.current !== null && p.group !== focusRef.current;
        dummy.position.set(p.x, p.y, p.z);
        dummy.scale.setScalar(p.radius * (dim ? DIM_SCALE : 1));
        dummy.updateMatrix();
        mesh.setMatrixAt(hovered, dummy.matrix);
      }
      hovered = idx;
      if (idx >= 0) {
        const n = layout[idx];
        dummy.position.set(n.x, n.y, n.z + 0.05);
        dummy.scale.setScalar(n.radius * 1.7);
        dummy.updateMatrix();
        mesh.setMatrixAt(idx, dummy.matrix);
        setTooltip(makeTooltip(n, clientX, clientY));
        // highlight connected edges
        const pos: number[] = [];
        constellation.edges.forEach((e) => {
          if (e.a !== n.name && e.b !== n.name) return;
          const a = byName.get(e.a);
          const b = byName.get(e.b);
          if (!a || !b) return;
          pos.push(a.x, a.y, a.z + 0.02, b.x, b.y, b.z + 0.02);
        });
        hlGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        hlGeo.attributes.position.needsUpdate = true;
        mount.style.cursor = 'pointer';
      } else {
        setTooltip(null);
        hlGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(0), 3));
        mount.style.cursor = '';
      }
      mesh.instanceMatrix.needsUpdate = true;
    };

    const pick = (e: PointerEvent): number => {
      const rect = mount.getBoundingClientRect();
      pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(pointer, host.camera);
      const hits = raycaster.intersectObject(mesh);
      const idx = hits.length > 0 ? hits[0].instanceId ?? -1 : -1;
      // While focused, de-emphasised nodes are inert - no hover, no click.
      if (idx >= 0 && focusRef.current && layout[idx].group !== focusRef.current) return -1;
      return idx;
    };

    const onOverlayUI = (e: PointerEvent) => !!(e.target as HTMLElement | null)?.closest?.('[data-ui]');

    const onMove = (e: PointerEvent) => {
      if (onOverlayUI(e)) {
        setHover(-1, 0, 0);
        return;
      }
      const rect = mount.getBoundingClientRect();
      mouse.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setHover(pick(e), e.clientX, e.clientY);
    };
    const onLeave = () => setHover(-1, 0, 0);
    const onClick = (e: PointerEvent) => {
      if (onOverlayUI(e)) return; // let the zoom buttons handle their own clicks
      const idx = pick(e);
      if (idx >= 0) {
        const n = layout[idx];
        onSelect(n);
        camTarget.x = n.x * 0.4;
        camTarget.y = n.y * 0.4; // z stays at the current focus depth
      } else {
        onSelect(null);
        const focus = focusRef.current;
        if (focus) {
          const hub = hubById.get(focus)!;
          camTarget.x = hub.hubX * 0.55;
          camTarget.y = hub.hubY * 0.55;
        } else {
          camTarget.x = 0;
          camTarget.y = 0;
        }
      }
    };

    mount.addEventListener('pointermove', onMove);
    mount.addEventListener('pointerleave', onLeave);
    mount.addEventListener('pointerdown', onClick);

    // ── Lifecycle ──────────────────────────────────────────────────────────
    return () => {
      mount.removeEventListener('pointermove', onMove);
      mount.removeEventListener('pointerleave', onLeave);
      mount.removeEventListener('pointerdown', onClick);
      applyFocusRef.current = null;
      host.dispose();
    };
  }, [onSelect]);

  // Bridge dynamic props into the running scene - refs, so ZERO scene rebuilds.
  useEffect(() => {
    focusRef.current = focusGroup;
    applyFocusRef.current?.();
  }, [focusGroup]);

  useEffect(() => {
    zoomRef.current = ZOOM_STEPS[zoomIdx];
    applyFocusRef.current?.();
  }, [zoomIdx]);

  const zoomBtn: React.CSSProperties = {
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: MONO,
    fontSize: 16,
    lineHeight: 1,
    borderRadius: 6,
    border: '1px solid var(--bd2)',
    background: 'rgba(13,14,18,0.7)',
    color: 'var(--text2)',
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
  };

  return (
    <div ref={mountRef} style={{ position: 'relative', width: '100%', height: 'clamp(420px, 58vh, 620px)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--bd)', background: 'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(45,212,191,0.04), transparent 75%)' }}>
      {/* 2D label overlay - sits above the WebGL canvas, below the tooltip/card */}
      <canvas ref={labelRef} data-labels aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }} />

      {/* zoom controls */}
      <div data-ui style={{ position: 'absolute', top: 10, right: 10, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 4 }}>
        <button
          type="button"
          aria-label="Zoom in"
          disabled={zoomIdx >= ZOOM_STEPS.length - 1}
          onClick={() => setZoomIdx((i) => Math.min(ZOOM_STEPS.length - 1, i + 1))}
          style={{ ...zoomBtn, opacity: zoomIdx >= ZOOM_STEPS.length - 1 ? 0.4 : 1, cursor: zoomIdx >= ZOOM_STEPS.length - 1 ? 'default' : 'pointer' }}
        >+</button>
        <button
          type="button"
          aria-label="Zoom out"
          disabled={zoomIdx <= 0}
          onClick={() => setZoomIdx((i) => Math.max(0, i - 1))}
          style={{ ...zoomBtn, opacity: zoomIdx <= 0 ? 0.4 : 1, cursor: zoomIdx <= 0 ? 'default' : 'pointer' }}
        >−</button>
      </div>

      {/* tooltip */}
      {tooltip && (
        <div role="status" style={{ position: 'absolute', left: tooltip.x, top: tooltip.y, pointerEvents: 'none', background: 'rgba(13,14,18,0.92)', border: `1px solid ${tooltip.color}55`, borderRadius: 6, padding: '7px 11px', backdropFilter: 'blur(6px)', zIndex: 3 }}>
          <div style={{ fontFamily: MONO, fontSize: 12, color: 'var(--foreground)', letterSpacing: '0.02em' }}>{tooltip.name}</div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: tooltip.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>{tooltip.group} · click for context</div>
        </div>
      )}

      <div aria-hidden style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text2)', pointerEvents: 'none', zIndex: 3, textAlign: 'center', maxWidth: '92%' }}>
        Hover a star · click for context · use the legend to isolate a cluster
      </div>
    </div>
  );
}
