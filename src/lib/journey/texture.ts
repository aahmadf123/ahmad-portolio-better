/** The settle zoom: a photo arrives at 1.3x and eases to 1x (FlyInScene). */
const SETTLE = 1.3;

/**
 * Which photo width the depth canvas should upload for this screen: the smallest that
 * still covers the screen's device pixels at the settle zoom, else the largest there
 * is, never beyond what the GPU allows.
 */
export function textureWidth(widths: number[], cssWidth: number, dpr: number, maxTexture = Infinity): number {
  const fits = widths.filter((w) => w <= maxTexture);
  const pool = fits.length ? fits : [Math.min(...widths)];
  const need = cssWidth * dpr * SETTLE;
  return pool.find((w) => w >= need) ?? pool[pool.length - 1];
}
