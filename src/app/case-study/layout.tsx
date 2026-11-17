import { SiteFooter } from '@/components/layout/SiteFooter';
import { CaseStudyPager } from '@/components/layout/CaseStudyPager';
import { CaseStudyBackdrop } from '@/components/journey/PhotoBackdrop';

// Shared frame for every case study: the page (with its SubpageHeader), then
// prev/next case studies and the site footer, so no case study is a dead end.
export default function CaseStudyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* isolate: the world's photo sits behind the page at z-index -1 */}
      <main id="main" tabIndex={-1} style={{ position: 'relative', isolation: 'isolate' }}>
        <CaseStudyBackdrop />
        {children}
        <CaseStudyPager />
      </main>
      <SiteFooter />
    </>
  );
}
