import type { Metadata } from 'next';
import { SubpageHeader } from '@/components/layout/SubpageHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { LightboxProvider } from '@/components/layout/LightboxProvider';
import { AboutSection } from '@/components/sections/about/AboutSection';
import { Background } from '@/components/about/Background';
import { SkillsSection } from '@/components/sections/skills/SkillsSection';
import { TimelineSection } from '@/components/sections/timeline/TimelineSection';
import { CredentialsSection } from '@/components/sections/credentials/CredentialsSection';
import { SignalsSection } from '@/components/sections/signals/SignalsSection';
import { NowSection } from '@/components/sections/now/NowSection';

const DESCRIPTION = 'Who Ahmad Firas is: background from Toledo to First Solar, the research, capabilities, timeline, credentials and what he is working on now.';

export const metadata: Metadata = {
  title: 'About',
  description: DESCRIPTION,
  alternates: { canonical: 'https://ahmadfx.xyz/about' },
  openGraph: {
    type: 'profile',
    url: 'https://ahmadfx.xyz/about',
    title: 'About · Ahmad Firas',
    description: DESCRIPTION,
    images: [{ url: '/Images/optimized/og.png', width: 1200, height: 630 }],
  },
};

export default function AboutPage() {
  return (
    <LightboxProvider>
      <SubpageHeader backHref="/" backLabel="Home" />
      <main id="main" tabIndex={-1}>
        <AboutSection />
        <Background />
        <SkillsSection />
        <TimelineSection />
        <CredentialsSection />
        <SignalsSection />
        <NowSection />
      </main>
      <SiteFooter />
    </LightboxProvider>
  );
}
