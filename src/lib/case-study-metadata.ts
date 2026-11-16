import type { Metadata } from 'next';
import { projects } from '@/lib/data/projects';
import { site } from '@/lib/data/site';

/**
 * Metadata for a case-study route, built statically from the slug.
 *
 * Replaces the old parent-layout generateMetadata that read the request path
 * from a proxy header: reading headers() made all ten case studies render on
 * every request instead of being prerendered. The title is the page's short
 * name; the root layout's "%s · Ahmad Firas" template adds the suffix, and the
 * same title is used for the browser tab and the social card.
 */
export function caseStudyMetadata(slug: string, title: string, description: string): Metadata {
  const project = projects.find((p) => p.slug === slug);
  const url = `${site.url}/case-study/${slug}`;
  const shareTitle = `${title} · ${site.name}`;
  const image = project?.image ? `${site.url}${project.image}` : undefined;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      siteName: site.name,
      title: shareTitle,
      description,
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description,
      images: image ? [image] : [],
    },
  };
}
