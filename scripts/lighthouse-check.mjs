// Lighthouse gate for the homepage against a running `next start` on :3200.
// Three runs each for mobile (default) and desktop; prints medians; exits 1 when
// mobile perf < 73 or desktop perf < 99 (the pre-redesign baseline, never regress).
//   node scripts/lighthouse-check.mjs [url]
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const url = process.argv[2] ?? 'http://localhost:3200/';
const dir = mkdtempSync(path.join(tmpdir(), 'lh-'));
const THRESHOLD = { mobile: 73, desktop: 99 };
const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

let failed = false;
for (const form of ['mobile', 'desktop']) {
  const scores = [];
  const lcp = [];
  for (let i = 0; i < 3; i++) {
    const out = path.join(dir, `${form}-${i}.json`);
    execFileSync('npx', ['--yes', 'lighthouse@12.6.0', url, '--quiet', '--only-categories=performance', '--output=json', `--output-path=${out}`, '--chrome-flags=--headless=new', ...(form === 'desktop' ? ['--preset=desktop'] : [])], { stdio: 'ignore', shell: process.platform === 'win32' });
    const r = JSON.parse(readFileSync(out, 'utf8'));
    scores.push(Math.round(r.categories.performance.score * 100));
    lcp.push(r.audits['largest-contentful-paint'].numericValue);
  }
  const m = median(scores);
  console.log(`${form}: perf ${scores.join(', ')} → median ${m} (min ${THRESHOLD[form]}), LCP median ${(median(lcp) / 1000).toFixed(2)}s`);
  if (m < THRESHOLD[form]) failed = true;
}
process.exit(failed ? 1 : 0);
