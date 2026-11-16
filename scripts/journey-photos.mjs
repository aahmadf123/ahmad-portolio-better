// Journey photos: download Ahmad's picks (scripts/journey-photos.json), apply one shared
// grade so six photos from different photographers read as one set, and emit responsive
// AVIF + WebP plus src/lib/journey-manifest.json. Run: npm run journey:photos
// Depth maps are a separate step (scripts/depth-maps.mjs) that fills manifest[id].depth.
import sharp from 'sharp';
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(ROOT, 'scripts', '.cache');
const OUT = path.join(ROOT, 'public', 'Images', 'journey');
const MANIFEST = path.join(ROOT, 'src', 'lib', 'journey-manifest.json');
const WIDTHS = [640, 1280, 1920, 2560];
/** Wider than this and the photo is shown as a panorama over a blurred copy of itself. */
const PANORAMA_ASPECT = 2.2;

const picks = JSON.parse(await readFile(path.join(ROOT, 'scripts', 'journey-photos.json'), 'utf8'));
await mkdir(CACHE, { recursive: true });
await mkdir(OUT, { recursive: true });

let previous = {};
try { previous = JSON.parse(await readFile(MANIFEST, 'utf8')); } catch { /* first run */ }

const exists = (f) => access(f).then(() => true, () => false);
const grade = (img) => img.modulate({ saturation: 0.88, brightness: 0.94 }).linear(1.04, -6);

const manifest = {};
for (const p of picks) {
  const raw = path.join(CACHE, `${p.id}.jpg`);
  if (!(await exists(raw))) {
    const res = await fetch(p.source, { headers: { 'User-Agent': 'portfolio-build/1.0' } });
    if (!res.ok) throw new Error(`${p.id}: download failed ${res.status}`);
    await writeFile(raw, Buffer.from(await res.arrayBuffer()));
  }
  const meta = await sharp(raw).metadata();
  const widths = [...new Set([...WIDTHS.filter((w) => w < meta.width), Math.min(meta.width, 2560)])].sort((a, b) => a - b);
  const webp = {};
  const avif = {};
  for (const w of widths) {
    const base = grade(sharp(raw).rotate().resize({ width: w, withoutEnlargement: true }));
    await base.clone().webp({ quality: 78 }).toFile(path.join(OUT, `${p.id}-${w}.webp`));
    await base.clone().avif({ quality: 55 }).toFile(path.join(OUT, `${p.id}-${w}.avif`));
    webp[w] = `/Images/journey/${p.id}-${w}.webp`;
    avif[w] = `/Images/journey/${p.id}-${w}.avif`;
  }
  const panorama = meta.width / meta.height > PANORAMA_ASPECT;
  let fill;
  if (panorama) {
    await grade(sharp(raw).resize({ width: 640 })).blur(18).modulate({ brightness: 0.6 }).webp({ quality: 60 })
      .toFile(path.join(OUT, `${p.id}-fill.webp`));
    fill = `/Images/journey/${p.id}-fill.webp`;
  }
  manifest[p.id] = {
    width: meta.width,
    height: meta.height,
    widths,
    webp,
    avif,
    ...(fill ? { fill } : {}),
    panorama,
    depth: previous[p.id]?.depth ?? '',
    focal: p.focal,
    alt: p.alt,
    credit: { photographer: p.photographer, page: p.page, licence: p.licence, licenceUrl: p.licenceUrl },
  };
  console.log(`${p.id}: ${meta.width}x${meta.height} → ${widths.join(', ')}${panorama ? ' (panorama)' : ''}`);
}
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`manifest: ${Object.keys(manifest).length} photos`);
