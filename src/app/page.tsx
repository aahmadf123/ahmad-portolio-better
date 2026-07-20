import { SiteHeader } from '@/components/layout/SiteHeader';
import { LightboxProvider } from '@/components/layout/LightboxProvider';
import { HeroSection } from '@/components/sections/hero/HeroSection';
import { StorySection } from '@/components/sections/story/StorySection';
import { SkillsSection } from '@/components/sections/skills/SkillsSection';
import { TimelineSection } from '@/components/sections/timeline/TimelineSection';
import { ProjectsSection } from '@/components/sections/projects/ProjectsSection';
import { ResearchSection } from '@/components/sections/research/ResearchSection';
import { AboutSection } from '@/components/sections/about/AboutSection';
import { CredentialsSection } from '@/components/sections/credentials/CredentialsSection';
import { FieldNotesSection } from '@/components/sections/field-notes/FieldNotesSection';
import { SignalsSection } from '@/components/sections/signals/SignalsSection';
import { InsightsSection } from '@/components/sections/insights/InsightsSection';
import { NowSection } from '@/components/sections/now/NowSection';
import { ContactSection } from '@/components/sections/contact/ContactSection';
import { SiteFooter } from '@/components/layout/SiteFooter';

export default function Home() {
  return (
    <LightboxProvider>
      <SiteHeader />
      <main style={{ position: 'relative', zIndex: 20, background: 'transparent' }}>
        <HeroSection />
        <StorySection />
        <SkillsSection />
        <TimelineSection />
        <ProjectsSection />
        <ResearchSection />
        <AboutSection />
        <CredentialsSection />
        <FieldNotesSection />
        <SignalsSection />
        <InsightsSection />
        <NowSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </LightboxProvider>
  );
}
