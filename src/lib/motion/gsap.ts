// Single GSAP registration point - import gsap/ScrollTrigger from here only,
// so plugins register exactly once and the whole app shares one config.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export { gsap, ScrollTrigger, MotionPathPlugin };

/** Refresh pin/scrub measurements once fonts have settled (call client-side). */
export function refreshOnFontsReady() {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
  }
}
