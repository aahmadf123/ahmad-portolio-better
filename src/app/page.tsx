import { SiteHeader } from '@/components/layout/SiteHeader';
import { LightboxProvider } from '@/components/layout/LightboxProvider';
import { OpeningScene } from '@/components/journey/OpeningScene';
import { WorldChapter } from '@/components/journey/WorldChapter';
import { ClosingScene } from '@/components/journey/ClosingScene';
import { HashLanding } from '@/components/journey/HashLanding';
import { JourneyCanvasLoader } from '@/components/journey/JourneyCanvasLoader';
import { ProjectModalProvider } from '@/components/sections/projects/ProjectModalProvider';
import { worlds } from '@/lib/data/worlds';
import { SkillsSection } from '@/components/sections/skills/SkillsSection';
import { TimelineSection } from '@/components/sections/timeline/TimelineSection';
import { AboutSection } from '@/components/sections/about/AboutSection';
import { CredentialsSection } from '@/components/sections/credentials/CredentialsSection';
import { FieldNotesSection } from '@/components/sections/field-notes/FieldNotesSection';
import { SignalsSection } from '@/components/sections/signals/SignalsSection';
import { NowSection } from '@/components/sections/now/NowSection';
import { ContactSection } from '@/components/sections/contact/ContactSection';
import { SiteFooter } from '@/components/layout/SiteFooter';

export default function Home() {
  return (
    <LightboxProvider>
      <ProjectModalProvider>
      <SiteHeader />
      <HashLanding />
      <JourneyCanvasLoader />
      <main id="main" tabIndex={-1} style={{ position: 'relative', zIndex: 20, background: 'transparent' }}>
        <OpeningScene />
        {worlds.map((w, i) => (
          <WorldChapter key={w.id} world={w} prev={i === 0 ? 'opening' : worlds[i - 1].photo} />
        ))}
        <ClosingScene />
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
