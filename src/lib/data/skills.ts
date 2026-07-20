// Skills — the 7 groups extracted verbatim from the original Skills section, plus
// a computed constellation graph: node weights = co-occurrence across project and
// job stacks (never hand-authored), edges = same-project/job co-membership.

import { projects } from './projects';
import { jobs } from './jobs';

export interface SkillGroup {
  id: string;
  label: string;
  color: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'languages',
    label: 'Languages',
    color: '#f59e0b',
    skills: ['Python', 'JavaScript', 'TypeScript', 'C++', 'Java', 'SQL', 'HTML/CSS', 'Embedded C', 'MATLAB', 'Simulink', 'Bash'],
  },
  {
    id: 'ml-ai',
    label: 'ML & AI',
    color: '#5b8af5',
    skills: ['PyTorch', 'TensorFlow', 'scikit-learn', 'RL', 'MAML', 'GNNs', 'GNN/GAT', 'PPO', 'Stable-Baselines3', 'Gym', 'Meta-Learning', 'NLP', 'Computer Vision', 'DistilBERT', 'Gemini AI'],
  },
  {
    id: 'mlops-data',
    label: 'MLOps & Data',
    color: '#f0823c',
    skills: ['Airflow', 'MLflow', 'Pandas', 'NumPy', 'AWS', 'AWS S3', 'AWS EC2', 'Docker', 'Git', 'GitHub Actions', 'CI/CD', 'Linux', 'Pandera', 'Prometheus', 'Hyperopt', 'DOMO', 'Slack API'],
  },
  {
    id: 'robotics',
    label: 'Robotics',
    color: '#a78bfa',
    skills: ['ROS 2', 'Gazebo', 'Gazebo Fortress', 'ArduPilot', 'OpenCV', 'YOLO11', 'NVIDIA Jetson', 'Jetson Orin NX', 'Sensor Fusion', 'VINS-Mono', 'HITL', 'AirSim', 'OAK-D Pro', 'SLAMTEC C1', 'X500 URDF', 'Q-Prop'],
  },
  {
    id: 'web-edge',
    label: 'Web & Edge',
    color: '#38bdf8',
    skills: ['React', 'Node.js', 'Express', 'FastAPI', 'Django', 'Cloudflare Workers', 'Hono', 'Deno', 'Cloudflare D1', 'Cloudflare R2', 'Drizzle ORM', 'Chrome Extension'],
  },
  {
    id: 'databases',
    label: 'Databases',
    color: '#2dd4bf',
    skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'PostGIS', 'pgvector', 'ETL', 'pgAdmin 4', 'Active Directory', 'Cisco AMP', 'Microsoft Defender'],
  },
  {
    id: 'microsoft',
    label: 'Microsoft',
    color: '#f472b6',
    skills: ['Azure AI', 'Copilot Studio', 'Power Automate', 'Power BI', 'M365', 'SharePoint', 'Microsoft Defender'],
  },
];

// ── Constellation graph (computed) ────────────────────────────────────────────

export interface SkillNode {
  name: string;
  group: string;
  /** Co-occurrence count across project/job stacks (min 1). */
  weight: number;
  /** Which projects/jobs reference this skill — powers the detail card. */
  usedIn: { kind: 'project' | 'job'; title: string; href: string }[];
}

export interface SkillEdge {
  a: string;
  b: string;
  strength: number;
}

export interface Constellation {
  nodes: SkillNode[];
  edges: SkillEdge[];
}

/** Case-insensitive match of a skill name against a stack tag (exact or alias). */
function matches(skill: string, tag: string): boolean {
  const s = skill.toLowerCase();
  const t = tag.toLowerCase();
  if (s === t) return true;
  // A few known aliases between the skills list and stack tags.
  const aliases: Record<string, string[]> = {
    'gnns': ['gnn/gat'],
    'rl': ['graph-based rl'],
    'nvidia jetson': ['jetson orin nx'],
    'gazebo': ['gazebo fortress'],
    'aws': ['aws s3', 'aws ec2', 'aws s3/ec2'],
    'pgadmin 4': ['pgadmin'],
    'yolo11': ['yolo'],
  };
  return (aliases[s] ?? []).includes(t);
}

function buildConstellation(): Constellation {
  const sources: { kind: 'project' | 'job'; title: string; href: string; tags: string[] }[] = [
    ...projects.map((p) => ({
      kind: 'project' as const,
      title: p.title,
      href: p.slug ? `/case-study/${p.slug}` : '#projects',
      tags: [...p.stacks, ...p.detailStacks],
    })),
    ...jobs.map((j) => ({ kind: 'job' as const, title: `${j.role} · ${j.company}`, href: '#timeline', tags: j.stack })),
  ];

  const nodes: SkillNode[] = [];
  for (const group of skillGroups) {
    for (const skill of group.skills) {
      const usedIn: SkillNode['usedIn'] = [];
      for (const src of sources) {
        if (src.tags.some((t) => matches(skill, t))) {
          if (!usedIn.some((u) => u.title === src.title)) {
            usedIn.push({ kind: src.kind, title: src.title, href: src.href });
          }
        }
      }
      nodes.push({ name: skill, group: group.id, weight: Math.max(1, usedIn.length), usedIn });
    }
  }

  // Edges: skills that co-occur in the same source, capped per node to keep the
  // graph legible (strongest first).
  const edgeMap = new Map<string, SkillEdge>();
  const byName = new Map(nodes.map((n) => [n.name, n]));
  for (const src of sources) {
    const present = nodes.filter((n) => src.tags.some((t) => matches(n.name, t))).map((n) => n.name);
    for (let i = 0; i < present.length; i++) {
      for (let j = i + 1; j < present.length; j++) {
        const [a, b] = [present[i], present[j]].sort();
        const key = `${a}|${b}`;
        const existing = edgeMap.get(key);
        if (existing) existing.strength += 1;
        else edgeMap.set(key, { a, b, strength: 1 });
      }
    }
  }
  const perNode = new Map<string, number>();
  const edges: SkillEdge[] = [];
  for (const e of [...edgeMap.values()].sort((x, y) => y.strength - x.strength)) {
    const ca = perNode.get(e.a) ?? 0;
    const cb = perNode.get(e.b) ?? 0;
    if (ca < 4 && cb < 4) {
      edges.push(e);
      perNode.set(e.a, ca + 1);
      perNode.set(e.b, cb + 1);
    }
  }

  void byName;
  return { nodes, edges };
}

export const constellation: Constellation = buildConstellation();
