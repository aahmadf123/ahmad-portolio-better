import { LightboxProvider } from '@/components/layout/LightboxProvider';
import { ProjectModalProvider } from '@/components/sections/projects/ProjectModalProvider';
import { FlightPathHero } from '@/components/home/FlightPathHero';
import { AboutBrief } from '@/components/home/AboutBrief';
import { FeaturedWork } from '@/components/sections/projects/FeaturedWork';
import { Background } from '@/components/about/Background';
import { FieldNotesSection } from '@/components/sections/field-notes/FieldNotesSection';
import { AboutSection } from '@/components/sections/about/AboutSection';
import { SkillsSection } from '@/components/sections/skills/SkillsSection';
import { TimelineSection } from '@/components/sections/timeline/TimelineSection';
import { CredentialsSection } from '@/components/sections/credentials/CredentialsSection';
import { SignalsSection } from '@/components/sections/signals/SignalsSection';
import { NowSection } from '@/components/sections/now/NowSection';
import { ContactSection } from '@/components/sections/contact/ContactSection';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { HomeNav } from '@/components/home/HomeNav';

/** Everything on one page: who, the work, the story, notes, about, and how to reach him. */
export default function Home() {
  return (
    <LightboxProvider>
      <ProjectModalProvider>
        <HomeNav />
        <main id="main" tabIndex={-1}>
          <FlightPathHero />
          <AboutBrief />
          <FeaturedWork />
          <Background />
          <FieldNotesSection />
          <AboutSection />
          <SkillsSection />
          <TimelineSection />
          <CredentialsSection />
          <SignalsSection />
          <NowSection />
          <ContactSection />
        </main>
        <SiteFooter />
      </ProjectModalProvider>
    </LightboxProvider>
  );
}
