// One-shot asset optimizer — run `node scripts/optimize-images.mjs` and commit
// the output in public/Images/optimized/. Not part of the build pipeline.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
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
await emit('og.png', sharp(Buffer.from(ogSvg)).png({ compressionLevel: 9 }));

console.log(report.join('\n'));
