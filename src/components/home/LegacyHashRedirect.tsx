'use client';

import { useEffect } from 'react';

/**
 * Links shared before the redesign (/#research, /#timeline, ...) point at chapters that
 * now live on /about. Send them there, keeping the anchor.
 */
const MOVED = new Set([
  'story', 'experience', 'prologue', 'chem-e-car', 'data-science', 'sports-analytics', 'research',
  'ai-engineering', 'next-chapter', 'insights', 'about', 'skills', 'timeline', 'credentials', 'signals', 'now',
]);

export function LegacyHashRedirect() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (MOVED.has(id)) window.location.replace(`/about#${id}`);
  }, []);
  return null;
}
