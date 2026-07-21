// One-shot asset optimizer — run `node scripts/optimize-images.mjs` and commit
// the output in public/Images/optimized/ plus src/lib/image-manifest.json.
// Not part of the build pipeline (no custom webpack/Turbopack hook).
import sharp from 'sharp';
import { mkdir, readdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(SCRIPT_PATH), '..');
const IMAGES = path.join(ROOT, 'public', 'Images');
const OUT = path.join(IMAGES, 'optimized');

await mkdir(OUT, { recursive: true });

const report = [];
async function emit(name, pipeline) {
  const out = path.join(OUT, name);
  const info = await pipeline.toFile(out);
  report.push(`${name}: ${(info.size / 1024).toFixed(0)}KB ${info.width}x${info.height}`);
}

// 1. Headshot — 4.3MB PNG → ~tens of KB webp at two sizes.
await emit('headshot-800.webp', sharp(path.join(IMAGES, 'my pic.png')).resize({ width: 800 }).webp({ quality: 82 }));
await emit('headshot-480.webp', sharp(path.join(IMAGES, 'my pic.png')).resize({ width: 480 }).webp({ quality: 80 }));

// 1b. Headshot lightbox target — near-native resolution for the hero's zoom
// view (source is 1447px wide; withoutEnlargement caps it there — still
// ~40x smaller than the 4.5MB original PNG the lightbox used to open).
await emit('headshot-1600.webp', sharp(path.join(IMAGES, 'my pic.png')).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78 }));

// 2. Favicon — 1.3MB logo → crisp 512/192 PNGs.
await emit('favicon-512.png', sharp(path.join(IMAGES, 'portfolio_logo_new.png')).resize({ width: 512, height: 512, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ compressionLevel: 9 }));
await emit('favicon-192.png', sharp(path.join(IMAGES, 'portfolio_logo_new.png')).resize({ width: 192, height: 192, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ compressionLevel: 9 }));

// 3. OG card — 1200x630 brand card (dark bg, teal→gold keyline, name + tagline).
const ogSvg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#2dd4bf"/>
      <stop offset="1" stop-color="#f59e0b"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.22" cy="0.30" r="0.9">
      <stop offset="0" stop-color="#2dd4bf" stop-opacity="0.14"/>
      <stop offset="0.55" stop-color="#0d0e12" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0d0e12"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="0" width="1200" height="6" fill="url(#bar)"/>
  <text x="96" y="150" font-family="DejaVu Sans, sans-serif" font-size="22" letter-spacing="10" fill="#2dd4bf">AHMADFX.XYZ</text>
  <text x="90" y="330" font-family="DejaVu Serif, Georgia, serif" font-size="132" fill="#f4f4f2">Ahmad Firas</text>
  <text x="96" y="420" font-family="DejaVu Sans, sans-serif" font-size="34" fill="#a3a8b0">Agentic AI Engineer · Sports Analytics · Researcher</text>
  <g font-family="DejaVu Sans, sans-serif" font-size="22" fill="#6b7078">
    <text x="96" y="540">UAV Autonomy · Football IQ · Enterprise Agentic AI · Toledo, OH</text>
  </g>
  <circle cx="1050" cy="150" r="70" fill="none" stroke="#2dd4bf" stroke-opacity="0.35" stroke-width="1.5"/>
  <circle cx="1050" cy="150" r="44" fill="none" stroke="#f59e0b" stroke-opacity="0.3" stroke-width="1.5"/>
  <circle cx="1050" cy="150" r="5" fill="#2dd4bf"/>
</svg>`;
const ogOutPath = path.join(OUT, 'og.png');
const ogUpToDate = (await fileExists(ogOutPath)) && (await stat(ogOutPath)).mtimeMs >= (await stat(SCRIPT_PATH)).mtimeMs;
if (ogUpToDate) {
  report.push(`og.png: (unchanged, script not newer)`);
} else {
  await emit('og.png', sharp(Buffer.from(ogSvg)).png({ compressionLevel: 9 }));
}

// ───────────────────────────────────────────────────────────────────────
// 4. Responsive pipeline — every /Images/... original referenced by the
//    app gets {480,960,1600}w webp variants (never upscaled) plus a
//    manifest entry consumed by <Pic> (src/components/ui/pic.tsx).
//    Discovery: grep src/**/*.{ts,tsx,md,mdx} for `/Images/...` string
//    literals (both %20-encoded and raw-space forms occur; normalized to
//    the decoded form, which is also the manifest's key form).
// ───────────────────────────────────────────────────────────────────────

const SRC = path.join(ROOT, 'src');
const MANIFEST_PATH = path.join(ROOT, 'src', 'lib', 'image-manifest.json');
const TARGET_WIDTHS = [480, 960, 1600];
const QUALITY = 78;

// portfolio_logo_new.png is only ever read directly by this script (as the
// favicon source) — it has no `/Images/...` string literal anywhere in
// src/, so it can't be grep-discovered. Seed it explicitly.
const EXTRA_SEEDS = ['/Images/portfolio_logo_new.png'];

// Known-heavy paths that MUST end up covered. Belt + suspenders on top of
// the grep below: fail loudly instead of silently under-covering.
const MUST_COVER = [
  '/Images/my pic.png',
  '/Images/athletics_group_pics.png',
  '/Images/Football_IQ_Analytics.png',
  '/Images/graph_RL.png',
  '/Images/DeepFlyer_pics.png',
  '/Images/Toledo_Athletics_Onboarding.png',
  '/Images/sdt_tool.png',
  '/Images/Sport Analytics Intern Image 2026.jpg',
  '/Images/portfolio_logo_new.png',
  '/Images/DeepTruth_Group.png',
  '/Images/field-notes/agentic-ai-in-production/agentic-ai-production-control-loop.png',
];

function safeDecode(s) {
  try { return decodeURIComponent(s); } catch { return s; }
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (/\.(tsx?|mdx?)$/.test(entry.name)) files.push(full);
  }
  return files;
}

async function discoverOriginals() {
  const files = await walk(SRC);
  const found = new Set(EXTRA_SEEDS);
  const patterns = [/'(\/Images\/[^']+)'/g, /"(\/Images\/[^"]+)"/g, /`(\/Images\/[^`]+)`/g];
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    for (const re of patterns) {
      for (const m of text.matchAll(re)) {
        const decoded = safeDecode(m[1]);
        if (decoded.startsWith('/Images/optimized/')) continue; // already-built output, not a source
        found.add(decoded);
      }
    }
  }
  return found;
}

function slugify(relPath) {
  const base = path.basename(relPath);
  const ext = path.extname(base);
  return path.basename(base, ext).toLowerCase().replace(/[ _]+/g, '-');
}

async function fileExists(p) {
  try { await stat(p); return true; } catch { return false; }
}

const originals = await discoverOriginals();

for (const must of MUST_COVER) {
  if (!originals.has(must)) {
    throw new Error(`image-manifest discovery missed a required path: ${must}`);
  }
}

const manifest = {};
const seenSlugs = new Map();

for (const originalPath of [...originals].sort()) {
  const rel = originalPath.replace(/^\/Images\//, '');
  const srcPath = path.join(IMAGES, ...rel.split('/'));
  if (!(await fileExists(srcPath))) {
    console.warn(`[image-manifest] skipping missing file: ${originalPath}`);
    continue;
  }

  const slug = slugify(rel);
  const collision = seenSlugs.get(slug);
  if (collision && collision !== originalPath) {
    throw new Error(`image-manifest slug collision: "${slug}" from both "${collision}" and "${originalPath}"`);
  }
  seenSlugs.set(slug, originalPath);

  // Fast header-only read for intrinsic size — correct for EXIF-rotated
  // sources too (sharp's metadata() reports raw, pre-rotation dimensions,
  // so a 90/270 orientation needs a manual swap for the manifest's w/h).
  const meta = await sharp(srcPath).metadata();
  const swapped = meta.orientation >= 5 && meta.orientation <= 8;
  const origW = swapped ? meta.height : meta.width;
  const origH = swapped ? meta.width : meta.height;

  const widths = TARGET_WIDTHS.filter((w) => w <= origW);
  if (widths.length === 0) widths.push(origW); // degenerate: source smaller than every target

  const srcStat = await stat(srcPath);
  for (const w of widths) {
    const outName = `${slug}-${w}.webp`;
    const outPath = path.join(OUT, outName);
    const upToDate = (await fileExists(outPath)) && (await stat(outPath)).mtimeMs >= srcStat.mtimeMs;
    if (upToDate) {
      report.push(`${outName}: (unchanged, source not newer)`);
      continue;
    }
    await emit(outName, sharp(srcPath).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: QUALITY }));
  }

  manifest[originalPath] = {
    base: `/Images/optimized/${slug}`,
    widths,
    w: origW,
    h: origH,
  };
}

const sortedManifest = {};
for (const key of Object.keys(manifest).sort()) sortedManifest[key] = manifest[key];

await writeFile(MANIFEST_PATH, JSON.stringify(sortedManifest, null, 2) + '\n', 'utf8');

console.log(report.join('\n'));
console.log(`\nimage-manifest.json: ${Object.keys(sortedManifest).length} originals -> ${path.relative(ROOT, MANIFEST_PATH)}`);
