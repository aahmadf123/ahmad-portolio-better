// The Story — five scroll-driven chapters. Copy is compressed from the site's own
// About/Experience/press text; every number and fact is real. Scenes are
// code-drawn (see story/ChapterScene.tsx) — swap in photography later if desired.

export type StoryScene = 'map' | 'systems' | 'neural' | 'solar' | 'field';

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
    body: 'Where it started: the University of Toledo, Computer Science & Engineering. First job on campus — IT support for students and medical staff, where 100% FERPA and HIPAA compliance mattered more than looking clever. The city keeps showing up in everything that follows.',
    scene: 'map',
    accent: '#2dd4bf',
    stat: { value: '2021–2026', label: 'B.S. Computer Science & Engineering' },
  },
  {
    id: 'engineering-foundation',
    kicker: 'Chapter 02 · 2023–2024',
    title: 'Learning by shipping.',
    body: 'A data governance framework at Park Place Technologies that survived every disaster-recovery test with zero data loss. An Arduino control system for a chemically-powered car that won Most Innovative Car Design worldwide. Different fields, same lesson: ask the right question when you have no home-field advantage.',
    scene: 'systems',
    accent: '#f0823c',
    stat: { value: '0', label: 'data loss across all DR simulations' },
  },
  {
    id: 'research-pivot',
    kicker: 'Chapter 03 · 2025',
    title: 'The research pivot.',
    body: 'LION Lab: graph-based reinforcement learning for drones that navigate worlds they have never seen — 72.8% zero-shot success, 97.3% human-in-the-loop reliability at sub-100ms. A $3,000 USRCAP fellowship, an ACM Computing Surveys paper, and an insurance risk model hitting R² = 0.982 in production-grade MLOps. The year AI stopped being coursework.',
    scene: 'neural',
    accent: '#5b8af5',
    milestone: true,
    stat: { value: '72.8%', label: 'zero-shot UAV deployment via MAML' },
  },
  {
    id: 'first-solar',
    kicker: 'Chapter 04 · 2026',
    title: 'Enterprise scale.',
    body: 'First Solar — first as a Microsoft Solution Developer building agentic AI in Copilot Studio, then full-time as Developer I on Oracle Cloud: VBCS, OIC, BI Publisher. Enterprise applications where thousands of people depend on the systems working, at a company building the energy transition.',
    scene: 'solar',
    accent: '#f59e0b',
    stat: { value: 'Developer I', label: 'First Solar · Jun 2026' },
  },
  {
    id: 'football-iq',
    kicker: 'Chapter 05 · Now',
    title: 'Football IQ.',
    body: 'Toledo Athletics: from roster-efficiency models to a 10-stage computer vision pipeline that turns practice film into evidence a coach can verify, correct, and teach from. Every corrected label becomes Toledo-specific training data. Trust is the product.',
    scene: 'field',
    accent: '#ef4444',
    milestone: true,
    stat: { value: '10-stage', label: 'CV pipeline · 18+ structured metrics' },
  },
];
