import { SiteHeader } from '@/components/layout/SiteHeader';
import { LightboxProvider } from '@/components/layout/LightboxProvider';
import { HeroSection } from '@/components/sections/hero/HeroSection';
import { StorySection } from '@/components/sections/story/StorySection';
import { AboutSection } from '@/components/sections/about/AboutSection';
import { ExperienceSection } from '@/components/sections/experience/ExperienceSection';
import { ProjectsSection } from '@/components/sections/projects/ProjectsSection';
import { FieldNotesSection } from '@/components/sections/field-notes/FieldNotesSection';
import { ResearchSection } from '@/components/sections/research/ResearchSection';
import { SkillsSection } from '@/components/sections/skills/SkillsSection';
import { PressSection } from '@/components/sections/signals/PressSection';
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
        <ExperienceSection />
        <ProjectsSection />
        <ResearchSection />
        <AboutSection />
        <FieldNotesSection />
        <SkillsSection />
        <PressSection />
        <NowSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </LightboxProvider>
  );
}
