// Research — extracted verbatim from the original Research section.

export interface ResearchPillar {
  n: string;
  label: string;
  color: string;
  desc: string;
}

export interface ResearchMetric {
  metric: string;
  label: string;
  color: string;
}

export interface ResearchMeta {
  preheader: string;
  headingAccent: string;
  headingRest: string;
  description: string;
  buttonText: string;
  pdf: string;
  image: string;
  imageAlt: string;
  metrics: ResearchMetric[];
  pillars: ResearchPillar[];
}

export const research: ResearchMeta = {
  preheader: 'ACM Computing Surveys · Under Review · 2025',
  headingAccent: 'AI Failure',
  headingRest: 'Taxonomy for Autonomous Systems',
  description:
    'A four-pillar taxonomy of AI failures in safety-critical autonomous environments. Synthesizes 37 documented incidents across 127 sources, formalizing how data-environment mismatch, oversight gaps, distributional brittleness, and multi-agent instability compound under operational stress.',
  buttonText: 'View Research',
  pdf: '/docs/Manuscript.pdf',
  image: '/Images/4-Pillars.png',
  imageAlt: '4-Pillars AI failure taxonomy',
  metrics: [
    { metric: '37', label: 'AI failures analyzed', color: '#5b8af5' },
    { metric: '127', label: 'Sources reviewed', color: '#2dd4bf' },
    { metric: '4', label: 'Pillars in taxonomy', color: '#f59e0b' },
    { metric: '2025', label: 'ACM CSUR submission', color: '#a78bfa' },
  ],
  pillars: [
    {
      n: '01',
      label: 'Data-Environment Mismatch',
      color: '#5b8af5',
      desc: 'Training distributions that diverge from deployment conditions. The initiating mechanism in 18 of 37 documented failures.',
    },
    {
      n: '02',
      label: 'Oversight-Gap Amplification',
      color: '#f59e0b',
      desc: 'Monitoring blind spots that allow small deviations to compound undetected until failure becomes irreversible.',
    },
    {
      n: '03',
      label: 'Distributional Brittleness',
      color: '#2dd4bf',
      desc: 'Systems that perform on benchmarks but fail at the boundary of their training manifold under novel real-world inputs.',
    },
    {
      n: '04',
      label: 'Multi-Agent Instability',
      color: '#a78bfa',
      desc: 'Emergent failure modes from agent interactions producing unsafe equilibria that are absent in single-agent testing.',
    },
  ],
};
