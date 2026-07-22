// Site-wide identity, socials, availability, and status config.
// Edit nowPlaying + availability here to update the header badge, NowPlayingBar,
// and contact section in one place.

export interface SiteConfig {
  name: string;
  shortName: string;
  role: string;
  /** Typed out segment-by-segment in the hero. */
  taglineSegments: string[];
  heroSub: string;
  email: string;
  location: string;
  socials: { github: string; linkedin: string };
  resumeUrl: string;
  cvUrl: string;
  degreeUrl: string;
  availability: { open: boolean; label: string; interests: string[] };
  nowPlaying: {
    icon: 'build' | 'learn' | 'ship';
    label: string;
    detail: string;
    href: string;
  };
  url: string;
}

export const site: SiteConfig = {
  name: 'Ahmad Firas',
  shortName: 'Ahmad.dev',
  role: 'Agentic AI Engineer · Sports Analytics · Researcher',
  taglineSegments: ['Agentic AI Engineer', 'Sports Analytics', 'Researcher'],
  heroSub:
    'Building AI systems for uncertain environments, from UAV autonomy research to enterprise agentic workflows.',
  email: 'firas.azfar@gmail.com',
  location: 'Toledo, OH',
  socials: {
    github: 'https://github.com/aahmadf123',
    linkedin: 'https://linkedin.com/in/ahmadfirasazfar',
  },
  resumeUrl: '/docs/Ahmad_Resume_Developer_I_FirstSolar.pdf',
  cvUrl: '/docs/Ahmad_CV_Developer_I_FirstSolar.pdf',
  degreeUrl: '/docs/CeD.26D8-NDTX-AGEW.pdf',
  availability: {
    open: true,
    label: 'Available · Toledo, OH',
    interests: [
      'AI Research',
      'ML Engineering',
      'Data Science',
      'Robotics & Autonomy',
      'Computer Vision',
      'Sports Analytics',
      'Full-Time Roles',
      'Research Collab',
    ],
  },
  nowPlaying: {
    icon: 'build',
    label: 'Now building',
    detail: 'Toledo Football IQ - 10-stage CV pipeline',
    href: '#projects',
  },
  url: 'https://ahmadfx.xyz',
};

/** Hero side-rail info cards (preserved from the original hero). */
export const heroFacts = [
  { label: 'Now', value: 'Developer I', sub: 'First Solar · Jun 2026', color: '#f59e0b' },
  { label: 'Research', value: 'LION Lab · CPHS Lab', sub: 'University of Toledo', color: '#5b8af5' },
  { label: 'Degree', value: 'B.S. CS & Engineering', sub: 'GPA 3.23 · 2026', color: '#a78bfa' },
  { label: 'Focus', value: 'Agentic AI · UAV · MLOps', sub: null, color: '#2dd4bf' },
] as const;
