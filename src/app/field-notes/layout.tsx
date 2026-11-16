import { SiteFooter } from '@/components/layout/SiteFooter';

export default function FieldNotesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main id="main" tabIndex={-1}>{children}</main>
      <SiteFooter />
    </>
  );
}
