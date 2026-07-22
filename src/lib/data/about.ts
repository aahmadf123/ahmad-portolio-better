// About - beliefs and bio extracted verbatim; the three-lens structure is new
// (assembled from existing copy). Personal data points marked TODO await real
// details from Ahmad - everything else is sourced from the site's own text.

export interface Belief {
  n: string;
  color: string;
  title: string;
  body: string;
}

export interface LensDataPoint {
  label: string;
  value: string;
  /** True when the value is a stand-in awaiting a personal fact from Ahmad. */
  interim?: boolean;
}

export interface Lens {
  id: 'engineer' | 'builder' | 'thinker';
  title: string;
  kicker: string;
  lead: string;
  body: string;
  beliefIds: string[];
  dataPoint: LensDataPoint;
  artifacts: { label: string; href: string; external?: boolean }[];
}

export interface AboutData {
  headline: string;
  bio: string;
  beliefs: Belief[];
  lenses: Lens[];
  signOff: { text: string; sub: string };
}

export const about: AboutData = {
  headline:
    "Chasing the gap between what AI can do in a lab and what it actually does when someone's counting on it.",
  bio: 'Computer Science & Engineering graduate from the University of Toledo. My work spans autonomous drone systems, enterprise AI, sports analytics, and data engineering. Not by design, but by instinct: I go where the hardest problems are.',
  beliefs: [
    {
      n: '01',
      color: '#f59e0b',
      title: 'Interdisciplinary by instinct',
      body: "The skill that transfers between fields isn't domain knowledge - it's knowing how to ask the right question when you don't have home-field advantage.",
    },
    {
      n: '02',
      color: '#5b8af5',
      title: 'Human-in-the-loop by design',
      body: "A system someone can't override isn't autonomous - it's unpredictable. The recovery mechanism is part of the design, not an afterthought.",
    },
    {
      n: '03',
      color: '#f0823c',
      title: 'Deployment from line one',
      body: 'Real edge cases, latency requirements, stakeholders who need to understand the output. That pressure makes the work honest.',
    },
  ],
  lenses: [
    {
      id: 'engineer',
      title: 'Engineer',
      kicker: 'Lens 01',
      lead: 'Systems that hold up when someone is counting on them.',
      body: 'From a PostgreSQL security database with zero data loss across every disaster-recovery test, to Oracle Cloud enterprise applications at First Solar - the through-line is engineering for the moment things go wrong, not just the demo. Human-in-the-loop by design; recovery mechanisms as first-class features.',
      beliefIds: ['02', '03'],
      dataPoint: { label: 'Track record', value: '0 data loss across all DR simulations' },
      artifacts: [{ label: 'Experience timeline', href: '#timeline' }],
    },
    {
      id: 'builder',
      title: 'Builder',
      kicker: 'Lens 02',
      lead: 'Ten projects, each a different operating condition.',
      body: 'A drone that navigates unseen worlds, a city reporting tool in production downtown, an insurance model that watches itself drift, a chemical car that won worldwide. Not by design, but by instinct: going where the hardest problems are - and shipping.',
      beliefIds: ['01'],
      dataPoint: { label: 'In production', value: 'battingcleanup.appliedlabs.org · downtown Toledo' },
      artifacts: [
        { label: 'Bodies of work', href: '#projects' },
        { label: 'GitHub', href: 'https://github.com/aahmadf123', external: true },
      ],
    },
    {
      id: 'thinker',
      title: 'Thinker',
      kicker: 'Lens 03',
      lead: 'Writing down what the work keeps teaching.',
      body: 'An ACM Computing Surveys taxonomy of how AI actually fails. Field notes on what "agentic" really means in production. Quantum computing certificates earned for curiosity, not the résumé. The questions compound faster than the answers - that is the point.',
      beliefIds: ['01', '02'],
      dataPoint: { label: 'Thinking in public', value: '46 field notes planned · 8 categories' },
      artifacts: [
        { label: 'Field notes', href: '/field-notes' },
        { label: 'Research', href: '#research' },
      ],
    },
  ],
  signOff: {
    text: "Let's build something real.",
    sub: '- Ahmad',
  },
};
