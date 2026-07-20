'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createSceneHost, seededRandom, supportsWebGL } from '@/lib/three/scene-kit';
import { constellation, skillGroups, type SkillNode } from '@/lib/data/skills';
import { MONO } from '@/components/shared/section-helpers';

interface LayoutNode extends SkillNode {
  x: number;
  y: number;
  z: number;
  color: string;
  radius: number;
}

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
        });
      });
  });
  return out;
}

/**
 * Interactive 3D skill constellation — ~130 instanced nodes clustered by
 * group, connected by co-occurrence edges. Hover highlights a node and its
 * connections with a tooltip; click opens the detail card. Idle 30fps,
 * IO-paused, fully disposed on unmount.
 */
export function ConstellationCanvas({ onSelect }: { onSelect: (node: SkillNode | null) => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; group: string; color: string } | null>(null);
  const [hubScreens, setHubScreens] = useState<{ id: string; label: string; color: string; x: number; y: number }[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !supportsWebGL()) return;

    const layout = computeLayout();
    const byName = new Map(layout.map((n) => [n.name, n]));

    const geo = new THREE.CircleGeometry(1, 20);
    const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.95 });
    const mesh = new THREE.InstancedMesh(geo, mat, layout.length);
    const dummy = new THREE.Object3D();
    const baseColor = new THREE.Color();
    layout.forEach((n, i) => {
      dummy.position.set(n.x, n.y, n.z);
      dummy.scale.setScalar(n.radius);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, baseColor.set(n.color));
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
      halo.setColorAt(i, baseColor.set(n.color));
    });

    // edges
    const edgePos: number[] = [];
    constellation.edges.forEach((e) => {
      const a = byName.get(e.a);
      const b = byName.get(e.b);
      if (!a || !b) return;
      edgePos.push(a.x, a.y, a.z, b.x, b.y, b.z);
    });
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgePos, 3));
    const edges = new THREE.LineSegments(
      edgeGeo,
      new THREE.LineBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.13, blending: THREE.AdditiveBlending })
    );

    // hover highlight edges
    const hlGeo = new THREE.BufferGeometry();
    hlGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(0), 3));
    const hlLines = new THREE.LineSegments(
      hlGeo,
      new THREE.LineBasicMaterial({ color: 0xf4f4f2, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending })
    );

    const group = new THREE.Group();
    group.add(halo, mesh, edges, hlLines);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hovered = -1;

    const host = createSceneHost({
      mount,
      fov: 40,
      z: 11,
      fpsCap: 30,
      onFrame: (t) => {
        mouse.x += (mouse.tx - mouse.x) * 0.05;
        mouse.y += (mouse.ty - mouse.y) * 0.05;
        group.rotation.y = mouse.x * 0.1;
        group.rotation.x = -mouse.y * 0.07;
        group.rotation.z = Math.sin(t * 0.1) * 0.015;
      },
      onResize: (h) => {
        // project hub label anchors to screen space
        const rect = mount.getBoundingClientRect();
        const labels = skillGroups.map((g, gi) => {
          const angle = (gi / skillGroups.length) * Math.PI * 2 - Math.PI / 2;
          const v = new THREE.Vector3(Math.cos(angle) * 6.6, Math.sin(angle) * 3.6 + 1.15, 0);
          v.project(h.camera);
          return {
            id: g.id,
            label: g.label,
            color: g.color,
            x: Math.min(Math.max(((v.x + 1) / 2) * rect.width, 54), rect.width - 54),
            y: Math.min(Math.max(((1 - v.y) / 2) * rect.height, 26), rect.height - 14),
          };
        });
        setHubScreens(labels);
      },
    });
    host.scene.add(group);
    host.start();
    setReady(true);

    const setHover = (idx: number, clientX: number, clientY: number) => {
      if (idx === hovered) {
        if (idx >= 0) {
          const n = layout[idx];
          const rect = mount.getBoundingClientRect();
          setTooltip({ x: clientX - rect.left, y: clientY - rect.top, name: n.name, group: skillGroups.find((g) => g.id === n.group)?.label ?? n.group, color: n.color });
        }
        return;
      }
      // restore previous
      if (hovered >= 0) {
        const p = layout[hovered];
        dummy.position.set(p.x, p.y, p.z);
        dummy.scale.setScalar(p.radius);
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
        const rect = mount.getBoundingClientRect();
        setTooltip({ x: clientX - rect.left, y: clientY - rect.top, name: n.name, group: skillGroups.find((g) => g.id === n.group)?.label ?? n.group, color: n.color });
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
      return hits.length > 0 ? (hits[0].instanceId ?? -1) : -1;
    };

    const onMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setHover(pick(e), e.clientX, e.clientY);
    };
    const onLeave = () => setHover(-1, 0, 0);
    const onClick = (e: PointerEvent) => {
      const idx = pick(e);
      onSelect(idx >= 0 ? layout[idx] : null);
    };

    mount.addEventListener('pointermove', onMove);
    mount.addEventListener('pointerleave', onLeave);
    mount.addEventListener('pointerdown', onClick);

    return () => {
      mount.removeEventListener('pointermove', onMove);
      mount.removeEventListener('pointerleave', onLeave);
      mount.removeEventListener('pointerdown', onClick);
      host.dispose();
    };
  }, [onSelect]);

  return (
    <div ref={mountRef} style={{ position: 'relative', width: '100%', height: 'clamp(420px, 58vh, 620px)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--bd)', background: 'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(45,212,191,0.04), transparent 75%)' }}>
      {/* hub labels */}
      {ready && hubScreens.map((h) => (
        <span key={h.id} aria-hidden style={{ position: 'absolute', left: h.x, top: h.y, transform: 'translate(-50%, -100%)', fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: h.color, opacity: 0.85, pointerEvents: 'none', textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
          {h.label}
        </span>
      ))}
      {/* tooltip */}
      {tooltip && (
        <div role="status" style={{ position: 'absolute', left: Math.min(tooltip.x + 14, (mountRef.current?.clientWidth ?? 300) - 150), top: tooltip.y - 12, pointerEvents: 'none', background: 'rgba(13,14,18,0.92)', border: `1px solid ${tooltip.color}55`, borderRadius: 6, padding: '7px 11px', backdropFilter: 'blur(6px)', zIndex: 3 }}>
          <div style={{ fontFamily: MONO, fontSize: 12, color: 'var(--foreground)', letterSpacing: '0.02em' }}>{tooltip.name}</div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: tooltip.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>{tooltip.group} · click for context</div>
        </div>
      )}
      <div aria-hidden style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', fontFamily: MONO, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text3)', pointerEvents: 'none' }}>
        Hover to explore · click a star for context
      </div>
    </div>
  );
}
