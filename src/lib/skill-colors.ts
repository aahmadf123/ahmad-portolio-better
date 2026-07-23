export const SKILL_COLOR_PALETTE = {
  amber:  '#f59e0b',
  blue:   '#5b8af5',
  teal:   '#2dd4bf',
  orange: '#f0823c',
  purple: '#a78bfa',
  pink:   '#f472b6',
  sky:    '#38bdf8',
  green:  '#22C55E',
  red:    '#ef4444',
} as const;

/**
 * Single authority for the 7 skill-group hues. The constellation nodes, the
 * legend chips, the radial cards and the fallback list all resolve their color
 * from here (via `skillGroups[i].color`), so the graph and every chip agree.
 * Seven separated hues - no two are confusable at a glance.
 */
export const SKILL_GROUP_COLORS: Record<string, string> = {
  'languages':  '#f59e0b', // amber
  'ml-ai':      '#5b8af5', // blue
  'mlops-data': '#ef4444', // red
  'robotics':   '#a78bfa', // purple
  'web-edge':   '#22C55E', // green
  'databases':  '#2dd4bf', // teal
  'microsoft':  '#f472b6', // pink
};

// Plain object - keys are lowercase, values are hex colors
const SKILL_COLORS: Record<string, string> = {
  // ── Languages ──────────────────────────────────────────
  'python':        '#f59e0b',
  'javascript':    '#f59e0b',
  'typescript':    '#f59e0b',
  'c++':           '#f59e0b',
  'java':          '#f59e0b',
  'sql':           '#f59e0b',
  'html/css':      '#f59e0b',
  'embedded c':    '#f59e0b',
  'matlab':        '#f59e0b',
  'simulink':      '#f59e0b',
  'bash':          '#f59e0b',

  // ── ML & AI ────────────────────────────────────────────
  'pytorch':           '#5b8af5',
  'tensorflow':        '#5b8af5',
  'scikit-learn':      '#5b8af5',
  'rl':                '#5b8af5',
  'maml':              '#5b8af5',
  'gnns':              '#5b8af5',
  'gnn/gat':           '#5b8af5',
  'ppo':               '#5b8af5',
  'stable-baselines3': '#5b8af5',
  'gym':               '#5b8af5',
  'meta-learning':     '#5b8af5',
  'nlp':               '#5b8af5',
  'computer vision':   '#5b8af5',
  'distilbert':        '#5b8af5',
  'gemini ai':         '#5b8af5',
  'graph-based rl':    '#5b8af5',
  'q-prop':            '#5b8af5',
  'shap':              '#5b8af5',
  'shap/lime':         '#5b8af5',
  'rf-detr':           '#5b8af5',
  'xgboost':           '#5b8af5',
  'pinn':              '#5b8af5',
  'taxonomy design':   '#5b8af5',
  'literature review': '#5b8af5',
  'ai safety':         '#5b8af5',

  // ── MLOps & Data ───────────────────────────────────────
  'airflow':        '#ef4444',
  'mlflow':         '#ef4444',
  'pandas':         '#ef4444',
  'numpy':          '#ef4444',
  'aws':            '#ef4444',
  'aws s3':         '#ef4444',
  'aws ec2':        '#ef4444',
  'aws s3/ec2':     '#ef4444',
  'docker':         '#ef4444',
  'git':            '#ef4444',
  'github actions': '#ef4444',
  'ci/cd':          '#ef4444',
  'linux':          '#ef4444',
  'pandera':        '#ef4444',
  'prometheus':     '#ef4444',
  'hyperopt':       '#ef4444',
  'domo':           '#ef4444',
  'slack api':      '#ef4444',

  // ── Robotics & Embedded ────────────────────────────────
  'ros 2':           '#a78bfa',
  'gazebo':          '#a78bfa',
  'gazebo fortress': '#a78bfa',
  'ardupilot':       '#a78bfa',
  'opencv':          '#a78bfa',
  'yolo11':          '#a78bfa',
  'yolo':            '#a78bfa',
  'nvidia jetson':   '#a78bfa',
  'jetson orrin nx': '#a78bfa',
  'jetson orin nx':  '#a78bfa',
  'sensor fusion':   '#a78bfa',
  'vins-mono':       '#a78bfa',
  'hitl':            '#a78bfa',
  'airsim':          '#a78bfa',
  'oak-d pro':       '#a78bfa',
  'slamtec c1':      '#a78bfa',
  'x500 urdf':       '#a78bfa',
  'bytetrack':       '#a78bfa',
  'bot-sort':        '#a78bfa',
  'rtmpose':         '#a78bfa',
  'cuda':            '#a78bfa',
  'arduino':         '#a78bfa',
  'pressure sensing':'#a78bfa',
  'solenoid control':'#a78bfa',
  'calibration':     '#a78bfa',

  // ── Web & Edge ─────────────────────────────────────────
  'react':              '#22C55E',
  'node.js':            '#22C55E',
  'express':            '#22C55E',
  'fastapi':            '#22C55E',
  'django':             '#22C55E',
  'cloudflare workers': '#22C55E',
  'hono':               '#22C55E',
  'deno':               '#22C55E',
  'cloudflare d1':      '#22C55E',
  'cloudflare r2':      '#22C55E',
  'drizzle orm':        '#22C55E',
  'chrome extension':   '#22C55E',
  'workers ai':         '#22C55E',
  'wrangler':           '#22C55E',
  'sidearm sports':     '#22C55E',
  'donor ux':           '#22C55E',
  'information architecture': '#22C55E',
  'digital fundraising':      '#22C55E',
  'brand strategy':           '#22C55E',
  'web strategy':             '#22C55E',

  // ── Databases ──────────────────────────────────────────
  'postgresql':       '#2dd4bf',
  'postgres':         '#2dd4bf',
  'mysql':            '#2dd4bf',
  'mongodb':          '#2dd4bf',
  'sqlite':           '#2dd4bf',
  'postgis':          '#2dd4bf',
  'pgvector':         '#2dd4bf',
  'etl':              '#2dd4bf',
  'pgadmin 4':        '#2dd4bf',
  'pgadmin':          '#2dd4bf',
  'active directory': '#2dd4bf',
  'cisco amp':        '#2dd4bf',
  'microsoft defender': '#2dd4bf',

  // ── Microsoft ──────────────────────────────────────────
  'azure ai':       '#f472b6',
  'copilot studio': '#f472b6',
  'power automate': '#f472b6',
  'power bi':       '#f472b6',
  'm365':           '#f472b6',
  'sharepoint':     '#f472b6',
};

export function resolveSkillColor(skill: string): string | undefined {
  return SKILL_COLORS[skill.trim().toLowerCase()];
}
