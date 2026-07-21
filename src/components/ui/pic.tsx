// Dependency-free, server-safe responsive <img> wrapper. No hooks, no
// 'use client' — usable from Server and Client Components alike. Reads
// sizing/variants from the build-time manifest (scripts/optimize-images.mjs)
// keyed by ORIGINAL public path so components never slugify — script/
// component drift is impossible, and any not-yet-migrated path still
// renders (graceful fallback to a plain <img>).
import type { ImgHTMLAttributes } from 'react';
import manifest from '@/lib/image-manifest.json';

interface ManifestEntry {
  base: string;
  widths: number[];
  w: number;
  h: number;
}

const IMAGE_MANIFEST = manifest as Record<string, ManifestEntry>;

const DEFAULT_SIZES = '(max-width: 900px) 100vw, 860px';

function decodeKey(src: string): string {
  try {
    return decodeURIComponent(src);
  } catch {
    return src;
  }
}

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height' | 'loading' | 'decoding' | 'srcSet'> & {
  /** ORIGINAL public path, decoded form: '/Images/my pic.png'. */
  src: string;
  alt: string;
  /** Default: '(max-width: 900px) 100vw, 860px'. */
  sizes?: string;
  /** Eager + fetchPriority high. Above-the-fold images only. */
  priority?: boolean;
  /** Taken from the manifest automatically; explicit props override. */
  width?: number;
  height?: number;
};

export function Pic({
  src,
  alt,
  sizes = DEFAULT_SIZES,
  priority = false,
  style,
  className,
  width,
  height,
  ...rest
}: Props) {
  const entry = IMAGE_MANIFEST[decodeKey(src)];

  if (!entry) {
    // Not (yet) covered by the manifest — render the original path directly
    // so the image still shows up; just without responsive variants.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={style}
        className={className}
        width={width}
        height={height}
        {...rest}
      />
    );
  }

  const largest = entry.widths[entry.widths.length - 1];
  const srcSet = entry.widths.map((w) => `${entry.base}-${w}.webp ${w}w`).join(', ');

  // Containers that already fix their own aspect ratio via absolute-fill
  // sizing (position:absolute + inset:0-style CSS) don't need the intrinsic
  // width/height hint — the CSS fully determines the box either way, but an
  // absolute-fill image is deliberately cropped to a foreign aspect ratio,
  // so the manifest's native w/h would be a misleading hint. Everything
  // else gets it for the CLS guard.
  const skipIntrinsicSize = style?.position === 'absolute';
  const w = width ?? (skipIntrinsicSize ? undefined : entry.w);
  const h = height ?? (skipIntrinsicSize ? undefined : entry.h);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${entry.base}-${largest}.webp`}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      width={w}
      height={h}
      style={style}
      className={className}
      {...rest}
    />
  );
}
