// Second half of journey:depth (see depth-maps.mjs): normalise each raw depth map to the
// full 0-255 range, soften edges so the parallax shader never tears at object
// boundaries, write public/Images/journey/<id>-depth.webp and record it in the manifest.
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(ROOT, 'scripts', '.cache');
const OUT = path.join(ROOT, 'public', 'Images', 'journey');
const MANIFEST = path.join(ROOT, 'src', 'lib', 'journey-manifest.json');

const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
for (const [id, entry] of Object.entries(manifest)) {
  const file = `${id}-depth.webp`;
  const info = await sharp(path.join(CACHE, `${id}-depth-raw.png`))
    .greyscale()
    .normalise()
    .resize({ width: Math.min(1024, entry.width) })
    .blur(1.5)
    .webp({ quality: 85 })
    .toFile(path.join(OUT, file));
  entry.depth = `/Images/journey/${file}`;
  console.log(`${id}: ${file} ${(info.size / 1024).toFixed(0)}KB`);
}
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
