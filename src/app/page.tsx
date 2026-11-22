import { LightboxProvider } from '@/components/layout/LightboxProvider';
import { ProjectModalProvider } from '@/components/sections/projects/ProjectModalProvider';
import { FlightPathHero } from '@/components/home/FlightPathHero';
import { FeaturedWork } from '@/components/sections/projects/FeaturedWork';
import { WorkIndex } from '@/components/home/WorkIndex';
import { FieldNotesSection } from '@/components/sections/field-notes/FieldNotesSection';
import { AboutBrief } from '@/components/home/AboutBrief';
import { ContactSection } from '@/components/sections/contact/ContactSection';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { LegacyHashRedirect } from '@/components/home/LegacyHashRedirect';

export default function Home() {
  return (
    <LightboxProvider>
      <ProjectModalProvider>
        <LegacyHashRedirect />
        <main id="main" tabIndex={-1}>
          <FlightPathHero />
          <FeaturedWork />
          <WorkIndex />
          <FieldNotesSection />
          <AboutBrief />
          <ContactSection />
        </main>
        <SiteFooter />
      </ProjectModalProvider>
    </LightboxProvider>
  );
}
