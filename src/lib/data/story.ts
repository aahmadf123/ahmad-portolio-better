// The Story — six scroll-driven chapters. Copy is compressed from the site's own
// About/Experience/press text; every number and fact is real. Scenes are
// code-drawn (see story/ChapterScene.tsx) — swap in photography later if desired.

export type StoryScene = 'map' | 'systems' | 'neural' | 'solar' | 'field' | 'horizon';

export interface StoryChapter {
  id: string;
  kicker: string;
  title: string;
  body: string;
  scene: StoryScene;
  accent: string;
  /** Gold milestone flash when this chapter enters. */
  milestone?: boolean;
  stat?: { value: string; label: string };
}

export const storyChapters: StoryChapter[] = [
  {
    id: 'toledo-origins',
    kicker: 'Chapter 01 · 2021',
    title: 'Toledo, Ohio.',
    body: 'Where it started: the University of Toledo, Computer Science & Engineering. First job on campus — IT support for students and medical staff, where 100% FERPA and HIPAA compliance mattered more than looking clever, and better documentation cut repeat incidents 40%. The city keeps showing up in everything that follows.',
    scene: 'map',
    accent: '#2dd4bf',
    stat: { value: '2021–2026', label: 'B.S. Computer Science & Engineering' },
  },
  {
    id: 'engineering-foundation',
    kicker: 'Chapter 02 · 2023–2024',
    title: 'Learning by shipping.',
    body: 'A data governance framework at Park Place Technologies: three security feeds merged into one Postgres store, validation catching 95% of bad entries at ingestion, zero data loss across every disaster-recovery test. An Arduino control system for a chemically-powered car that won Most Innovative Car Design worldwide, third in poster and presentation. Different fields, same lesson: ask the right question when you have no home-field advantage.',
    scene: 'systems',
    accent: '#f0823c',
    stat: { value: '0', label: 'data loss across all DR simulations' },
  },
  {
    id: 'research-pivot',
    kicker: 'Chapter 03 · 2025',
    title: 'The research pivot.',
    body: 'LION Lab: graph-based reinforcement learning for drones that navigate worlds they have never seen — 72.8% zero-shot success, 97.3% human-in-the-loop reliability at sub-100ms. DeepFlyer made the same ideas teachable: 80% PPO success, a Gazebo world that cold-starts in under a second. A $3,000 USRCAP fellowship, an ACM Computing Surveys paper, an insurance model at R² = 0.982. The year AI stopped being coursework.',
    scene: 'neural',
    accent: '#5b8af5',
    milestone: true,
    stat: { value: '72.8%', label: 'zero-shot UAV deployment via MAML' },
  },
  {
    id: 'first-solar',
    kicker: 'Chapter 04 · 2026',
    title: 'Enterprise scale.',
    body: 'First Solar — first as a Microsoft Solution Developer building agentic AI in Copilot Studio, wiring Azure AI into Microsoft 365 and leading two other interns. Then full-time as Developer I on Oracle Cloud: VBCS, OIC, BI Publisher, REST integrations under code review. Enterprise applications the business runs on, at a company building the energy transition.',
    scene: 'solar',
    accent: '#f59e0b',
    stat: { value: 'Developer I', label: 'First Solar · Jun 2026' },
  },
  {
    id: 'football-iq',
    kicker: 'Chapter 05 · Now',
    title: 'Football IQ.',
    body: 'Toledo Athletics: from DOMO roster-efficiency dashboards to a 10-stage computer vision pipeline that turns practice film, including overhead drone footage, into evidence a coach can verify, correct, and teach from — targeting 90%+ field-marking accuracy. Every corrected label becomes Toledo-specific training data. Trust is the product.',
    scene: 'field',
    accent: '#ef4444',
    milestone: true,
    stat: { value: '10-stage', label: 'CV pipeline · 18+ structured metrics' },
  },
  {
    id: 'whats-next',
    // kicker mirrors nowUpdated in now.ts ('June 2026'); keep in sync when that updates.
    kicker: 'Epilogue · June 2026',
    title: 'The next chapter.',
    body: "Two certifications in flight — Oracle's Application Integration Professional, Microsoft's AI Transformation Leader. A football computer-vision model still in progress, athletics platforms in build alongside it: a student-athlete health-insurance site, an onboarding portal. Still in Toledo, still open — AI research, ML engineering, sports analytics. Same instinct as chapter one: go where the hardest problems are.",
    scene: 'horizon',
    accent: '#f59e0b',
    milestone: false,
    stat: { value: 'Open', label: 'Available · Toledo, OH' },
  },
];
