import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Docs - Ahmad Firas',
  description: 'Résumé, CV, degree, and certifications - all the documents behind the portfolio.',
  alternates: { canonical: 'https://ahmadfx.xyz/docs' },
  openGraph: {
    type: 'website',
    url: 'https://ahmadfx.xyz/docs',
    title: 'Docs - Ahmad Firas',
    description: 'Résumé, CV, degree, and certifications - all the documents behind the portfolio.',
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
