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

export const fieldNotes: FieldNote[] = [
  // ── AI & Machine Learning ──────────────────────────────────────
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
  { slug: 'uav-navigation-without-gps', title: 'How to build a UAV that navigates without GPS: lessons from real research', date: '', excerpt: '', tags: ['UAV', 'Robotics', 'Navigation', 'Research'], category: 'AI & Machine Learning', readingTime: 10, published: false },
  { slug: 'zero-shot-deployment-meta-learning', title: 'Zero-shot deployment explained: how meta-learning lets AI generalize without retraining', date: '', excerpt: '', tags: ['Meta-Learning', 'Zero-Shot', 'Deployment'], category: 'AI & Machine Learning', readingTime: 9, published: false },
  { slug: 'why-ai-systems-fail-taxonomy', title: 'Why AI systems fail: a taxonomy of 37 real-world breakdowns every developer should know', date: '', excerpt: '', tags: ['AI Safety', 'Failure Modes', 'Engineering'], category: 'AI & Machine Learning', readingTime: 15, published: false },
  { slug: 'shap-lime-interpretable-ml', title: 'SHAP and LIME explained: a practical guide to making ML models interpretable', date: '', excerpt: '', tags: ['XAI', 'SHAP', 'LIME', 'Interpretability'], category: 'AI & Machine Learning', readingTime: 11, published: false },
  { slug: 'ppo-vs-sac-reinforcement-learning', title: 'PPO vs SAC: a practical guide to choosing the right reinforcement learning algorithm', date: '', excerpt: '', tags: ['Reinforcement Learning', 'PPO', 'SAC'], category: 'AI & Machine Learning', readingTime: 10, published: false },

  // ── Sports Analytics ───────────────────────────────────────────
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
  { slug: 'sports-analytics-platform-architecture', title: 'How to architect a sports analytics platform from scratch: a practical guide', date: '', excerpt: '', tags: ['Sports Analytics', 'Architecture', 'Engineering'], category: 'Sports Analytics', readingTime: 13, published: false },
  { slug: 'context-adjusted-metrics-coaching', title: 'Why raw stats lie: how context-adjusted metrics make better coaching decisions', date: '', excerpt: '', tags: ['Sports Analytics', 'Metrics', 'Coaching'], category: 'Sports Analytics', readingTime: 9, published: false },
  { slug: 'sports-data-dashboards-coaches', title: 'How to turn complex sports data into dashboards coaches actually use', date: '', excerpt: '', tags: ['Data Visualization', 'Dashboards', 'Sports'], category: 'Sports Analytics', readingTime: 8, published: false },
  { slug: 'what-teams-look-for-in-data-analysts', title: 'What teams are really looking for when they hire a sports data analyst', date: '', excerpt: '', tags: ['Career', 'Sports Analytics', 'Hiring'], category: 'Sports Analytics', readingTime: 7, published: false },
  { slug: 'expected-value-football-xg', title: 'Expected value in football: how to borrow xG from soccer and make it work on the gridiron', date: '', excerpt: '', tags: ['Expected Value', 'xG', 'Football Analytics'], category: 'Sports Analytics', readingTime: 10, published: false },
  { slug: 'ml-game-film-analysis', title: 'How machine learning is changing the way coaches watch game film', date: '', excerpt: '', tags: ['Machine Learning', 'Computer Vision', 'Film Study'], category: 'Sports Analytics', readingTime: 9, published: false },
  { slug: 'player-tracking-computer-vision', title: 'How to build a player tracking model using computer vision', date: '', excerpt: '', tags: ['Computer Vision', 'Player Tracking', 'Sports'], category: 'Sports Analytics', readingTime: 11, published: false },
  { slug: 'context-adjusted-metrics-vs-box-scores', title: 'Why context-adjusted metrics matter more than box scores in modern football analytics', date: '', excerpt: '', tags: ['Metrics', 'Football', 'Analytics'], category: 'Sports Analytics', readingTime: 8, published: false },
  { slug: 'analytics-vs-traditional-scouting', title: 'Sports analytics vs. traditional scouting: how data and intuition can work together', date: '', excerpt: '', tags: ['Scouting', 'Data', 'Decision-Making'], category: 'Sports Analytics', readingTime: 9, published: false },
  { slug: 'nfl-analytics-revolution-college', title: "What the NFL's analytics revolution looks like from inside a college athletic department", date: '', excerpt: '', tags: ['NFL', 'College Athletics', 'Analytics'], category: 'Sports Analytics', readingTime: 8, published: false },
  { slug: 'collecting-cleaning-real-sports-data', title: 'How to collect and clean messy real-world sports data: what no dataset tutorial prepares you for', date: '', excerpt: '', tags: ['Data Engineering', 'Sports Data', 'ETL'], category: 'Sports Analytics', readingTime: 10, published: false },
  { slug: 'first-sports-prediction-model', title: "The beginner's guide to building your first sports prediction model in Python", date: '', excerpt: '', tags: ['Python', 'Machine Learning', 'Beginners'], category: 'Sports Analytics', readingTime: 12, published: false },

  // ── Future-Focused & Emerging Tech ────────────────────────────
  { slug: 'quantum-computing-for-software-engineers', title: 'Quantum computing explained for software engineers: no physics degree required', date: '', excerpt: '', tags: ['Quantum Computing', 'Explainer', 'Engineering'], category: 'Future-Focused & Emerging Tech', readingTime: 11, published: false },
  { slug: 'quantum-machine-learning', title: 'Quantum machine learning: where quantum computing and AI are starting to intersect', date: '', excerpt: '', tags: ['Quantum ML', 'AI', 'Research'], category: 'Future-Focused & Emerging Tech', readingTime: 10, published: false },
  { slug: 'drones-self-driving-robots-convergence', title: "What drones, self-driving cars, and robots have in common, and where they're all heading", date: '', excerpt: '', tags: ['Robotics', 'Autonomous Systems', 'Future Tech'], category: 'Future-Focused & Emerging Tech', readingTime: 9, published: false },
  { slug: 'ai-agents-2026-whats-working', title: "AI agents in 2026: what's actually working, what's still hype, and what's next", date: '', excerpt: '', tags: ['AI Agents', 'Industry', 'Trends'], category: 'Future-Focused & Emerging Tech', readingTime: 10, published: false },

  // ── Career, Research & Learnings ──────────────────────────────
  { slug: 'student-to-ai-engineer-nonlinear-path', title: 'How to go from computer engineering student to AI engineer: a non-linear path', date: '', excerpt: '', tags: ['Career', 'AI Engineering', 'Personal Story'], category: 'Career, Research & Learnings', readingTime: 10, published: false },
  { slug: 'writing-first-research-paper', title: 'How to write your first undergraduate research paper: a practical step-by-step guide', date: '', excerpt: '', tags: ['Research', 'Academic Writing', 'Undergrad'], category: 'Career, Research & Learnings', readingTime: 9, published: false },
  { slug: 'what-hackathon-wins-teach-you', title: "What a hackathon win actually teaches you that coursework never will", date: '', excerpt: '', tags: ['Hackathons', 'Learning', 'Engineering'], category: 'Career, Research & Learnings', readingTime: 7, published: false },
  { slug: 'leading-technical-teams-while-learning', title: "How to lead a technical team when you're still learning yourself", date: '', excerpt: '', tags: ['Leadership', 'Teams', 'Engineering'], category: 'Career, Research & Learnings', readingTime: 8, published: false },
  { slug: 'real-sports-analytics-vs-kaggle', title: 'What real-world sports analytics taught me that Kaggle competitions never could', date: '', excerpt: '', tags: ['Sports Analytics', 'Real-World', 'Kaggle'], category: 'Career, Research & Learnings', readingTime: 8, published: false },

  // ── Broader Tech & Society ─────────────────────────────────────
  { slug: 'ai-failures-patterns-37-cases', title: '37 times AI went wrong: patterns every developer should recognize before it\'s too late', date: '', excerpt: '', tags: ['AI Safety', 'Case Studies', 'Failures'], category: 'Broader Tech & Society', readingTime: 14, published: false },
  { slug: 'autonomous-system-accountability', title: 'Who is responsible when an autonomous system makes a deadly mistake?', date: '', excerpt: '', tags: ['AI Ethics', 'Accountability', 'Law'], category: 'Broader Tech & Society', readingTime: 9, published: false },
  { slug: 'multilingual-software-engineer-advantage', title: 'How being multilingual makes you a better software engineer than you\'d expect', date: '', excerpt: '', tags: ['Languages', 'Engineering', 'Soft Skills'], category: 'Broader Tech & Society', readingTime: 7, published: false },
  { slug: 'international-student-american-tech', title: "What it's like being an international student in American tech: the things nobody warns you about", date: '', excerpt: '', tags: ['International Students', 'Tech Career', 'Personal'], category: 'Broader Tech & Society', readingTime: 8, published: false },

  // ── Philosophy of AI & Intelligent Systems ────────────────────
  { slug: 'blindly-trusting-ai-dangerous', title: 'Why blindly trusting your AI model is the most dangerous thing you can do as an engineer', date: '', excerpt: '', tags: ['AI Safety', 'Engineering Ethics', 'Trust'], category: 'Philosophy of AI & Intelligent Systems', readingTime: 8, published: false },
  { slug: 'ai-helps-vs-ai-decides', title: 'The line between AI that helps and AI that decides, and why it matters enormously', date: '', excerpt: '', tags: ['AI Ethics', 'Autonomy', 'Design'], category: 'Philosophy of AI & Intelligent Systems', readingTime: 9, published: false },
  { slug: 'case-for-human-in-the-loop', title: "Full autonomy isn't always the goal: the case for keeping humans in the loop", date: '', excerpt: '', tags: ['HITL', 'AI Safety', 'Autonomy'], category: 'Philosophy of AI & Intelligent Systems', readingTime: 8, published: false },
  { slug: 'prompt-engineering-real-skill', title: 'Prompt engineering is a real engineering skill: here\'s how to treat it like one', date: '', excerpt: '', tags: ['Prompt Engineering', 'LLMs', 'Engineering'], category: 'Philosophy of AI & Intelligent Systems', readingTime: 9, published: false },
  { slug: 'intelligence-vs-autonomy', title: "Intelligence vs. autonomy: why full self-direction isn't always the answer", date: '', excerpt: '', tags: ['AI', 'Autonomy', 'Philosophy'], category: 'Philosophy of AI & Intelligent Systems', readingTime: 8, published: false },
  { slug: 'can-ai-truly-understand', title: 'What does it mean to truly understand something, and can AI ever get there?', date: '', excerpt: '', tags: ['AI Philosophy', 'Understanding', 'Cognition'], category: 'Philosophy of AI & Intelligent Systems', readingTime: 10, published: false },
  { slug: 'most-dangerous-ai-almost-always-right', title: 'Why the most dangerous AI systems are the ones that are almost always right', date: '', excerpt: '', tags: ['AI Safety', 'Reliability', 'Risk'], category: 'Philosophy of AI & Intelligent Systems', readingTime: 9, published: false },

  // ── Building Things in Public ──────────────────────────────────
  { slug: 'solo-sports-analytics-platform', title: 'How to build and ship a full-stack sports analytics platform as a solo developer', date: '', excerpt: '', tags: ['Solo Dev', 'Sports Analytics', 'Full-Stack'], category: 'Building Things in Public', readingTime: 12, published: false },
  { slug: 'solo-developer-production-stack-2026', title: "The solo developer's production stack in 2026: what actually works and why", date: '', excerpt: '', tags: ['Stack', 'DevOps', '2026'], category: 'Building Things in Public', readingTime: 10, published: false },
  { slug: 'claude-copilot-devin-same-project', title: 'I used Claude, GitHub Copilot, and Devin on the same project: here\'s what I found', date: '', excerpt: '', tags: ['AI Tools', 'Comparison', 'Productivity'], category: 'Building Things in Public', readingTime: 11, published: false },
  { slug: 'managing-projects-with-ai-agents', title: 'How to manage a software project when your teammates are AI agents', date: '', excerpt: '', tags: ['AI Agents', 'Project Management', 'Solo Dev'], category: 'Building Things in Public', readingTime: 10, published: false },
  { slug: 'idea-to-deployed-data-heavy-app', title: 'From idea to deployed: how to take a data-heavy app from concept to production', date: '', excerpt: '', tags: ['Deployment', 'Data Apps', 'Product'], category: 'Building Things in Public', readingTime: 11, published: false },

  // ── Tech Career & The Student-to-Engineer Path ────────────────
  { slug: 'what-internships-actually-teach', title: 'What internships actually teach you that no university course ever will', date: '', excerpt: '', tags: ['Internships', 'Career', 'Learning'], category: 'Tech Career & The Student-to-Engineer Path', readingTime: 8, published: false },
  { slug: 'landing-undergraduate-research-roles', title: 'How to land undergraduate research roles, even before you have publications', date: '', excerpt: '', tags: ['Research', 'Undergraduate', 'Career'], category: 'Tech Career & The Student-to-Engineer Path', readingTime: 7, published: false },
  { slug: 'research-to-industry-what-transfers', title: 'What transfers from research to industry and what completely falls apart', date: '', excerpt: '', tags: ['Research', 'Industry', 'Career Transition'], category: 'Tech Career & The Student-to-Engineer Path', readingTime: 9, published: false },
  { slug: 'hackathons-career-accelerator', title: 'Why hackathons are the most underrated career accelerator for engineering students', date: '', excerpt: '', tags: ['Hackathons', 'Career', 'Students'], category: 'Tech Career & The Student-to-Engineer Path', readingTime: 7, published: false },
  { slug: 'evaluating-new-technology-worth-learning', title: 'How to evaluate whether a new technology is worth learning: a practical mental model', date: '', excerpt: '', tags: ['Learning', 'Technology', 'Career Strategy'], category: 'Tech Career & The Student-to-Engineer Path', readingTime: 8, published: false },
  { slug: 'managing-internship-research-projects', title: 'How to manage a full-time internship, active research, and side projects at the same time', date: '', excerpt: '', tags: ['Time Management', 'Internship', 'Research'], category: 'Tech Career & The Student-to-Engineer Path', readingTime: 8, published: false },
  { slug: 'graph-neural-networks-explained', title: 'Graph Neural Networks explained plainly: what they are and why they\'re becoming essential', date: '', excerpt: '', tags: ['GNN', 'Deep Learning', 'Graph Networks'], category: 'Tech Career & The Student-to-Engineer Path', readingTime: 11, published: false },
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
