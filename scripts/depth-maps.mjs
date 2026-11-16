// Depth maps for the journey photos, made once and committed. Uses Depth Anything V2
// (small) through transformers.js; near = white. Run after journey:photos:
//   npm run journey:depth
// transformers.js ships its own sharp; loading the project's newer sharp in the same
// process clashes on Windows (two libvips builds), so post-processing runs in a child
// process (scripts/depth-post.mjs).
import { pipeline, RawImage } from '@huggingface/transformers';
import { mkdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(ROOT, 'scripts', '.cache');
const MANIFEST = path.join(ROOT, 'src', 'lib', 'journey-manifest.json');

await mkdir(CACHE, { recursive: true });
const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
const estimate = await pipeline('depth-estimation', 'onnx-community/depth-anything-v2-small');

for (const [id, entry] of Object.entries(manifest)) {
  const w = entry.widths.includes(1280) ? 1280 : Math.max(...entry.widths);
  const image = await RawImage.read(path.join(ROOT, 'public', entry.webp[w]));
  const { depth } = await estimate(image);
  await depth.save(path.join(CACHE, `${id}-depth-raw.png`));
  console.log(`${id}: raw depth ${depth.width}x${depth.height}`);
}

const post = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'depth-post.mjs')], { stdio: 'inherit' });
process.exit(post.status ?? 1);
