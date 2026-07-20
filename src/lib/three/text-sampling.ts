// Samples rendered text from an offscreen canvas into particle target points.

export interface SampledText {
  /** Normalized points, centered at origin: x in [-aspect, aspect], y in [-1, 1]. */
  points: Float32Array;
  /** width / height of the sampled text block. */
  aspect: number;
  count: number;
}

/**
 * Draws `lines` in `fontCSS` (a resolved font-family string) on an offscreen
 * canvas and samples opaque pixels at `stride` into normalized target points.
 */
export function sampleTextPoints(opts: {
  lines: string[];
  fontFamily: string;
  fontSize?: number;
  stride?: number;
  weight?: string;
}): SampledText {
  const { lines, fontFamily, fontSize = 220, stride = 4, weight = '400' } = opts;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  const font = `${weight} ${fontSize}px ${fontFamily}`;
  ctx.font = font;
  const lineHeight = fontSize * 0.94;
  const widths = lines.map((l) => ctx.measureText(l).width);
  const textW = Math.max(...widths, 1);
  const textH = lineHeight * lines.length;

  const pad = fontSize * 0.2;
  canvas.width = Math.ceil(textW + pad * 2);
  canvas.height = Math.ceil(textH + pad * 2);

  ctx.font = font;
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'top';
  lines.forEach((line, i) => {
    const x = pad + (textW - widths[i]) / 2;
    ctx.fillText(line, x, pad + i * lineHeight);
  });

  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pts: number[] = [];
  for (let y = 0; y < height; y += stride) {
    for (let x = 0; x < width; x += stride) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 128) {
        // normalize: center origin, y up, scale so height spans [-1, 1]
        const nx = ((x - width / 2) / height) * 2;
        const ny = -((y - height / 2) / height) * 2;
        pts.push(nx, ny);
      }
    }
  }

  return { points: new Float32Array(pts), aspect: width / height, count: pts.length / 2 };
}
