export interface FieldNote {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  category: string;
  heroImage?: string;
  readingTime: number;
  published: boolean;
}

export interface CategoryConfig {
  label: string;
  color: string;
  icon: string;
}

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  'AI & Machine Learning':              { label: 'AI & Machine Learning',            color: '#F0B429', icon: '🤖' },
  'Sports Analytics':                   { label: 'Sports Analytics',                  color: '#10B981', icon: '🏈' },
  'Future-Focused & Emerging Tech':     { label: 'Future-Focused & Emerging Tech',    color: '#4B7BF5', icon: '🔮' },
  'Career, Research & Learnings':       { label: 'Career, Research & Learnings',      color: '#8B5CF6', icon: '🎓' },
  'Broader Tech & Society':             { label: 'Broader Tech & Society',            color: '#EF4444', icon: '🌍' },
  'Philosophy of AI & Intelligent Systems': { label: 'Philosophy of AI',             color: '#EC4899', icon: '🧠' },
  'Building Things in Public':          { label: 'Building Things in Public',         color: '#F97316', icon: '🏗️' },
  'Tech Career & The Student-to-Engineer Path': { label: 'Tech Career & Student-to-Engineer', color: '#06B6D4', icon: '🌐' },
};

// Only published essays live here. New notes are added when they are written -
// there is no preset backlog of planned topics.
export const fieldNotes: FieldNote[] = [
  {
    slug: 'agentic-ai-in-production',
    title: 'What agentic AI actually means in production: beyond the buzzword',
    date: '2026-05-19',
    excerpt: 'Agentic AI is not magic autonomy. In production, it is a controlled loop where a model can plan, use tools, observe results, and decide what to do next inside strict operational boundaries.',
    tags: ['AI', 'Agentic AI', 'Production Systems', 'AI Engineering'],
    category: 'AI & Machine Learning',
    heroImage: '/Images/field-notes/agentic-ai-in-production/agentic-ai-production-control-loop.png',
    readingTime: 12,
    published: true,
  },
  {
    slug: 'small-data-college-sports-ai',
    title: "The small-data problem: why college sports AI can't just copy the pros",
    date: '2026-07-21',
    excerpt: 'Pro sports analytics runs on oceans of data. A college season gives you twelve games, a roster that dissolves every year, and no time to wait for statistical significance. Building AI that works here is a different discipline, and a more interesting one.',
    tags: ['AI', 'Sports Analytics', 'Small Data', 'Statistics', 'College Athletics'],
    category: 'Sports Analytics',
    heroImage: '/Images/field-notes/small-data-college-sports-ai/small-data-season-noise.png',
    readingTime: 12,
    published: true,
  },
  {
    slug: 'opponent-digital-twins',
    title: 'Opponent digital twins: what it takes to simulate next Saturday’s rival',
    date: '2026-07-21',
    excerpt: 'Engineering has spent two decades building digital twins of jet engines and factory lines. Now sports wants one of next week’s opponent: a simulated rival you can rehearse against before kickoff. Some of that transfers. The most important parts don’t, because a play-caller, unlike a turbine, watches film of you too.',
    tags: ['AI', 'Sports Analytics', 'Digital Twins', 'Simulation', 'Game Planning'],
    category: 'Sports Analytics',
    heroImage: '/Images/field-notes/opponent-digital-twins/opponent-twin-mirror.png',
    readingTime: 12,
    published: true,
  },
];

export function getFieldNote(slug: string): FieldNote | undefined {
  return fieldNotes.find(n => n.slug === slug);
}

export function getPublishedNotes(): FieldNote[] {
  return fieldNotes.filter(n => n.published);
}

export function getNotesByCategory(): Record<string, FieldNote[]> {
  return fieldNotes.reduce((acc, note) => {
    if (!acc[note.category]) acc[note.category] = [];
    acc[note.category].push(note);
    return acc;
  }, {} as Record<string, FieldNote[]>);
}
