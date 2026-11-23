import { SiteFooter } from '@/components/layout/SiteFooter';
import { CaseStudyPager } from '@/components/layout/CaseStudyPager';

// Shared frame for every case study: the page (with its SubpageHeader), then
// prev/next case studies and the site footer, so no case study is a dead end.
export default function CaseStudyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main id="main" tabIndex={-1} style={{ position: 'relative' }}>
        {children}
        <CaseStudyPager />
      </main>
      <SiteFooter />
    </>
  );
}
