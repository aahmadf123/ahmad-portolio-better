// The photo journey: five worlds, one per side of Ahmad, in journey order.
// Every piece of text here is taken BY REFERENCE from the existing data files
// (story.ts, projects.ts, insights.ts). Nothing is retyped or reworded, so the
// no-information-loss tests keep holding. The only new copy is two world titles
// and the Chem-E Car stat, marked below.

import manifestJson from '@/lib/journey-manifest.json';
import { storyChapters, sentences, type StoryChapter, type StoryScene } from './story';
import { caseStudySlugs } from './projects';
import type { Insight } from './insights';
import type { FieldNote } from '@/lib/field-notes';

export type WorldId = 'chem-e-car' | 'data-science' | 'sports-analytics' | 'research' | 'ai-engineering';
export type PhotoId = WorldId | 'opening';
/** One photo in src/lib/journey-manifest.json (written by scripts/journey-photos.mjs). */
export interface ManifestEntry {
  width: number;
  height: number;
  /** Widths actually emitted, ascending (the Glass Bowl tops out at 1366). */
  widths: number[];
  webp: Record<string, string>;
  avif: Record<string, string>;
  /** Wider than 2.2:1, so it's shown whole over the blurred `fill` instead of cropped. */
  panorama: boolean;
  fill?: string;
  depth: string;
  focal: { x: number; y: number };
  alt: string;
  /** Stock photos only: Ahmad's own photos carry `own` and their public path instead. */
  credit?: { photographer: string; page: string; licence: string; licenceUrl: string };
  own?: boolean;
  source?: string;
}
const manifest = manifestJson as Record<PhotoId, ManifestEntry>;

/** The drawing beside a world's words: the old Story scenes, plus one for the Chem-E Car. */
export type StageSceneId = StoryScene | 'chem';
/** One of Ahmad's own photos (an original public path, as in the other data files). */
export interface StagePhoto { src: string; alt: string }

export interface World {
  id: WorldId;
  n: string;
  label: string;
  years: string;
  /** Hex only: alpha is appended in JS and canvas reads it. */
  accent: string;
  title: string;
  paragraphs: string[];
  stat: { value: string; label: string };
  projectSlugs: string[];
  photo: PhotoId;
  /** Scroll length of the fly-in, in viewport heights. Chem-E Car is the short one. */
  length: number;
  /** Fills the side of the stage opposite the words: a drawing behind Ahmad's own photos. */
  scene: StageSceneId;
  gallery: StagePhoto[];
  /** A readable caption under the drawing (kept out of the drawing itself). */
  artCaption?: string;
}

const ch = (id: string): StoryChapter => {
  const c = storyChapters.find((x) => x.id === id);
  if (!c) throw new Error(`story chapter ${id} missing`);
  return c;
};
const foundation = sentences(ch('engineering-foundation').body);

export const worlds: World[] = [
  {
    id: 'chem-e-car', n: '01', label: 'Chem-E Car (AIChE)', years: '2025', accent: '#fb7185',
    title: 'Chemistry, wired.', // new copy
    paragraphs: [foundation[1]],
    stat: { value: 'Worldwide', label: 'Most Innovative Car Design · AIChE Chem-E Car' }, // new copy
    projectSlugs: ['camel-car-cheme-car-control-system'],
    photo: 'chem-e-car', length: 1.8,
    scene: 'chem',
    artCaption: '~5 PSI setpoint · solenoid cut',
    gallery: [
      { src: '/Images/AIChE ChemECar_International.jpg', alt: 'The UT AIChE Chem-E Car team at the international competition' },
      { src: '/Images/AIChE.jpg', alt: 'The UT AIChE team at the 2025 AIChE Annual Meeting in Boston' },
    ],
  },
  {
    id: 'data-science', n: '02', label: 'Data Science', years: '2023–2024', accent: '#a78bfa',
    title: ch('engineering-foundation').title,
    paragraphs: [foundation[0], foundation[2]],
    stat: ch('engineering-foundation').stat!,
    projectSlugs: ['homeowner-loss-prediction'],
    photo: 'data-science', length: 2.5,
    scene: 'systems',
    gallery: [
      { src: '/Images/SeniorDesign_Pipeline.jpeg', alt: 'The Homeowner Loss Prediction pipeline' },
    ],
  },
  {
    id: 'sports-analytics', n: '03', label: 'Sports Analytics', years: 'Now', accent: '#22c55e',
    title: 'The game, measured.', // new copy
    paragraphs: [ch('football-iq').body],
    stat: ch('football-iq').stat!,
    projectSlugs: ['toledo-football-iq-computer-vision-analytics', 'toledo-athletics-onboarding-portal', 'champions-complex-digital-campaign'],
    photo: 'sports-analytics', length: 2.5,
    scene: 'field',
    gallery: [
      { src: '/Images/athletics_group_pics.png', alt: 'UToledo Athletics feature' },
      { src: '/Images/Sport Analytics Intern Image 2026.jpg', alt: 'Ahmad as a Toledo Athletics sports analytics intern' },
      { src: '/Images/Football_IQ_Analytics.png', alt: 'Toledo Football IQ analytics' },
    ],
  },
  {
    id: 'research', n: '04', label: 'Research', years: '2025', accent: '#5b8af5',
    title: ch('research-pivot').title,
    paragraphs: [ch('research-pivot').body],
    stat: ch('research-pivot').stat!,
    projectSlugs: ['graph-based-rl-uav-autonomy', 'deepflyer-drone-reinforcement-learning'],
    photo: 'research', length: 2.5,
    scene: 'neural',
    gallery: [
      { src: '/Images/DeepFlyer_pics.png', alt: 'DeepFlyer drone research' },
      { src: '/Images/graph_RL.png', alt: 'Graph-Based RL for UAV Autonomy research poster' },
      { src: '/Images/4-Pillars.png', alt: '4-Pillars AI Failure Taxonomy' },
    ],
  },
  {
    id: 'ai-engineering', n: '05', label: 'AI Engineering', years: '2026', accent: '#38bdf8',
    title: ch('first-solar').title,
    paragraphs: [ch('first-solar').body],
    stat: ch('first-solar').stat!,
    projectSlugs: ['deeptruth-ai-fact-checking', 'security-discovery-tool', 'batting-cleanup-smart-city-waste-reporting'],
    photo: 'ai-engineering', length: 2.5,
    scene: 'solar',
    gallery: [
      { src: '/Images/DeepTruth_Group.png', alt: 'The DeepTruth team' },
      { src: '/Images/Batting_Cleanup.jpg', alt: 'Batting Cleanup' },
      { src: '/Images/sdt_tool.png', alt: 'Security Discovery Tool' },
    ],
  },
];

const scene = (id: string, kicker: string, stage: StageSceneId) => {
  const c = ch(id);
  return { photo: 'opening' as const, kicker, title: c.title, body: c.body, stat: c.stat!, scene: stage };
};
/**
 * "Toledo, Ohio." Where the story starts, over the opening photo. Ahmad (2026-11-20)
 * shortened its paragraph; the full chapter stays in story.ts as the content record.
 */
export const opening = {
  ...scene('toledo-origins', '2021', 'map'),
  body: 'I studied Computer Science & Engineering at the University of Toledo and worked in campus IT support.',
};

/** Projects shown directly below the hero, ahead of the chronological background. */
export const featuredProjectSlugs = ['toledo-football-iq-computer-vision-analytics', 'homeowner-loss-prediction'] as const;
/** "The next chapter." Closes the journey, flying back to the opening photo. */
export const closing = scene('whats-next', ch('whats-next').kicker, 'horizon');

export function worldForProject(slug: string): WorldId {
  const w = worlds.find((x) => x.projectSlugs.includes(slug));
  if (!w) throw new Error(`project ${slug} is in no world`);
  return w.id;
}

/** The World a case study belongs to (for back links and labels). */
export function worldOf(slug: string): World {
  return worlds.find((w) => w.id === worldForProject(slug))!;
}

export function worldForInsight(i: Insight): WorldId {
  return worldForProject(i.source.href.split('/').pop()!);
}

const NOTE_PHOTO: Record<string, PhotoId> = {
  'Sports Analytics': 'sports-analytics',
  'AI & Machine Learning': 'ai-engineering',
  'Career, Research & Learnings': 'research',
};
export function photoForFieldNote(n: FieldNote): PhotoId {
  return NOTE_PHOTO[n.category] ?? 'opening';
}

export function journeyPhoto(id: PhotoId): ManifestEntry {
  return manifest[id];
}

// Fail the build, not the page, if a project is added without a world.
for (const slug of caseStudySlugs) worldForProject(slug);
