'use client';

// PostHog, loaded off the critical path. posthog-js (~270 KB, plus its session
// recorder and surveys scripts) used to load and initialise on every route
// before first paint. Now it downloads once the browser is idle after load;
// events captured before that are queued and flushed on init, so no pageview
// or custom event is lost.

type PostHog = typeof import('posthog-js').default;

const KEY = 'phc_tgKy2P54nKkABu7mH3fgi1ZWeuKaDuICpdessu9chiM';

let client: PostHog | null = null;
let loading: Promise<PostHog | null> | null = null;
const queue: Array<[string, Record<string, unknown> | undefined]> = [];

export function loadAnalytics(): Promise<PostHog | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (!loading) {
    loading = import('posthog-js')
      .then(({ default: posthog }) => {
        posthog.init(KEY, {
          api_host: 'https://us.i.posthog.com',
          capture_pageview: false,
          capture_pageleave: true,
          persistence: 'localStorage',
          // Scroll-depth properties read scrollY and the page height on every scroll
          // event, forcing a layout each time: ~1.1s of stalls per scroll of the photo
          // journey on a slow CPU. Pageviews, events and session replay are unaffected.
          disable_scroll_properties: true,
        });
        client = posthog;
        for (const [event, props] of queue.splice(0)) posthog.capture(event, props);
        return posthog;
      })
      .catch(() => null); // analytics is optional; never break the page
  }
  return loading;
}

/** Capture an event now, or queue it until PostHog has loaded. */
export function capture(event: string, props?: Record<string, unknown>) {
  if (client) {
    try { client.capture(event, props); } catch { /* optional */ }
  } else {
    queue.push([event, props]);
  }
}

/** Load analytics once the page is idle (after load), with a timeout fallback. */
export function loadAnalyticsWhenIdle() {
  if (typeof window === 'undefined') return;
  const start = () => {
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    if (ric) ric(() => { void loadAnalytics(); }, { timeout: 4000 });
    else window.setTimeout(() => { void loadAnalytics(); }, 2500);
  };
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}
