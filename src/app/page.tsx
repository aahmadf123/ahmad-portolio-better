import { Header } from '@/components/ui/header-2';
import { LightboxProvider } from '@/components/layout/LightboxProvider';
import { HomeBackground } from '@/components/layout/HomeBackground';
import { HeroSection } from '@/components/sections/hero/HeroSection';
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

const headerLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#timeline' },
  { label: 'Work', href: '#projects' },
  { label: 'Field Notes', href: '#field-notes' },
  { label: 'Research', href: '#research' },
  { label: 'Skills', href: '#skills' },
  { label: 'Press', href: '#signals' },
  { label: 'Now', href: '#now' },
  { label: 'Contact', href: '#contact' },
];

export default function Home() {
  return (
    <LightboxProvider>
      <Header links={headerLinks} />
      <HomeBackground />
      <main style={{ position: 'relative', zIndex: 20, background: 'transparent' }}>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <FieldNotesSection />
        <ResearchSection />
        <SkillsSection />
        <PressSection />
        <NowSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </LightboxProvider>
  );
}
