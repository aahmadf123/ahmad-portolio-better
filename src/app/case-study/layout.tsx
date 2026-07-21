import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { projects } from '@/lib/data/projects';
import { site } from '@/lib/data/site';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';
  const slug = pathname.split('/').pop();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: `Case Study — ${site.name}`,
    };
  }

  const title = `${project.title} — Case Study · ${site.name}`;
  const description = project.story ?? project.headline;
  const url = `${site.url}/case-study/${project.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      images: project.image ? [{ url: `${site.url}${project.image}` }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: project.image ? [`${site.url}${project.image}`] : [],
    },
  };
}

export default function CaseStudyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
