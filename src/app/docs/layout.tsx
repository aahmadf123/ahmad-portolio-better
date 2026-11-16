import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/SiteFooter';

// Title is the short name; the root template appends " · Ahmad Firas".
export const metadata: Metadata = {
  title: 'Docs',
  description: 'Résumé, CV, degree, and certifications - all the documents behind the portfolio.',
  alternates: { canonical: 'https://ahmadfx.xyz/docs' },
  openGraph: {
    type: 'website',
    url: 'https://ahmadfx.xyz/docs',
    title: 'Docs · Ahmad Firas',
    description: 'Résumé, CV, degree, and certifications - all the documents behind the portfolio.',
    images: [{ url: '/Images/optimized/og.png', width: 1200, height: 630 }],
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main id="main" tabIndex={-1}>{children}</main>
      <SiteFooter />
    </>
  );
}
