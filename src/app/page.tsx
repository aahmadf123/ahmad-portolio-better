import { SiteHeader } from '@/components/layout/SiteHeader';
import { LightboxProvider } from '@/components/layout/LightboxProvider';
import { OpeningScene, PrologueScene } from '@/components/journey/OpeningScene';
import { FeaturedWork } from '@/components/sections/projects/FeaturedWork';
import { ChapterNav } from '@/components/layout/ChapterNav';
import { EXPERIENCE } from '@/lib/data/sections';
import { SERIF } from '@/components/shared/section-helpers';
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
      <ChapterNav />
      <HashLanding />
      <JourneyCanvasLoader />
      <main id="main" tabIndex={-1} style={{ position: 'relative', zIndex: 20, background: 'transparent' }}>
        <OpeningScene />
        <FeaturedWork />
        <section id="experience" aria-labelledby="experience-title" style={{ position: 'relative', zIndex: 20 }}>
          {/* Old links from before the redesign: /#story lands on the Toledo prologue. */}
          <span id="story" data-anchor-for="prologue" aria-hidden style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1 }} />
          <div style={{ background: 'var(--background)', padding: 'clamp(32px, 5vw, 64px) clamp(16px, 4vw, 52px) clamp(20px, 3vw, 32px)', borderTop: '1px solid var(--bd)' }}>
            <h2 id="experience-title" style={{ maxWidth: 1280, margin: '0 auto', fontFamily: SERIF, fontWeight: 400, fontSize: 'var(--fs-section-head)', lineHeight: 1.05, letterSpacing: '-0.02em', color: 'var(--foreground)' }}>{EXPERIENCE}</h2>
          </div>
          <PrologueScene />
          {worlds.map((w, i) => (
            <WorldChapter key={w.id} world={w} prev={i === 0 ? 'opening' : worlds[i - 1].photo} />
          ))}
          <ClosingScene />
        </section>
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
