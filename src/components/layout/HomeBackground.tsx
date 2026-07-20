'use client';

import dynamic from 'next/dynamic';

// Three.js background — client-only (ssr:false requires a client module).
// Phase 2 replaces NebulaCube with the hero particle scene.
const NebulaCube = dynamic(
  () => import('@/components/ui/explorations-with-gsap-and-scroll-trigger').then(m => ({ default: m.NebulaCube })),
  { ssr: false }
);

export function HomeBackground() {
  return <NebulaCube />;
}
