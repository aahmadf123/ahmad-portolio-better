export const SKILL_COLOR_PALETTE = {
  amber:  '#F0B429',
  blue:   '#4B7BF5',
  teal:   '#2DD4C8',
  orange: '#F07832',
  purple: '#A78BFA',
  pink:   '#F472B6',
  sky:    '#0EA5E9',
  green:  '#22C55E',
  red:    '#EF4444',
} as const;

/**
 * Single authority for the 7 skill-group hues. The constellation nodes, the
 * legend chips, the radial cards and the fallback list all resolve their color
 * from here (via `skillGroups[i].color`), so the graph and every chip agree.
 * Seven separated hues - no two are confusable at a glance.
 */
export const SKILL_GROUP_COLORS: Record<string, string> = {
  'languages':  '#F0B429', // amber
  'ml-ai':      '#4B7BF5', // blue
  'mlops-data': '#EF4444', // red
  'robotics':   '#A78BFA', // purple
  'web-edge':   '#22C55E', // green
  'databases':  '#2DD4C8', // teal
  'microsoft':  '#F472B6', // pink
};

// Plain object - keys are lowercase, values are hex colors
const SKILL_COLORS: Record<string, string> = {
  // ── Languages ──────────────────────────────────────────
  'python':        '#F0B429',
  'javascript':    '#F0B429',
  'typescript':    '#F0B429',
  'c++':           '#F0B429',
  'java':          '#F0B429',
  'sql':           '#F0B429',
  'html/css':      '#F0B429',
  'embedded c':    '#F0B429',
  'matlab':        '#F0B429',
  'simulink':      '#F0B429',
  'bash':          '#F0B429',

  // ── ML & AI ────────────────────────────────────────────
  'pytorch':           '#4B7BF5',
  'tensorflow':        '#4B7BF5',
  'scikit-learn':      '#4B7BF5',
  'rl':                '#4B7BF5',
  'maml':              '#4B7BF5',
  'gnns':              '#4B7BF5',
  'gnn/gat':           '#4B7BF5',
  'ppo':               '#4B7BF5',
  'stable-baselines3': '#4B7BF5',
  'gym':               '#4B7BF5',
  'meta-learning':     '#4B7BF5',
  'nlp':               '#4B7BF5',
  'computer vision':   '#4B7BF5',
  'distilbert':        '#4B7BF5',
  'gemini ai':         '#4B7BF5',
  'graph-based rl':    '#4B7BF5',
  'q-prop':            '#4B7BF5',
  'shap':              '#4B7BF5',
  'shap/lime':         '#4B7BF5',
  'rf-detr':           '#4B7BF5',
  'xgboost':           '#4B7BF5',
  'pinn':              '#4B7BF5',
  'taxonomy design':   '#4B7BF5',
  'literature review': '#4B7BF5',
  'ai safety':         '#4B7BF5',

  // ── MLOps & Data ───────────────────────────────────────
  'airflow':        '#EF4444',
  'mlflow':         '#EF4444',
  'pandas':         '#EF4444',
  'numpy':          '#EF4444',
  'aws':            '#EF4444',
  'aws s3':         '#EF4444',
  'aws ec2':        '#EF4444',
  'aws s3/ec2':     '#EF4444',
  'docker':         '#EF4444',
  'git':            '#EF4444',
  'github actions': '#EF4444',
  'ci/cd':          '#EF4444',
  'linux':          '#EF4444',
  'pandera':        '#EF4444',
  'prometheus':     '#EF4444',
  'hyperopt':       '#EF4444',
  'domo':           '#EF4444',
  'slack api':      '#EF4444',

  // ── Robotics & Embedded ────────────────────────────────
  'ros 2':           '#A78BFA',
  'gazebo':          '#A78BFA',
  'gazebo fortress': '#A78BFA',
  'ardupilot':       '#A78BFA',
  'opencv':          '#A78BFA',
  'yolo11':          '#A78BFA',
  'yolo':            '#A78BFA',
  'nvidia jetson':   '#A78BFA',
  'jetson orrin nx': '#A78BFA',
  'jetson orin nx':  '#A78BFA',
  'sensor fusion':   '#A78BFA',
  'vins-mono':       '#A78BFA',
  'hitl':            '#A78BFA',
  'airsim':          '#A78BFA',
  'oak-d pro':       '#A78BFA',
  'slamtec c1':      '#A78BFA',
  'x500 urdf':       '#A78BFA',
  'bytetrack':       '#A78BFA',
  'bot-sort':        '#A78BFA',
  'rtmpose':         '#A78BFA',
  'cuda':            '#A78BFA',
  'arduino':         '#A78BFA',
  'pressure sensing':'#A78BFA',
  'solenoid control':'#A78BFA',
  'calibration':     '#A78BFA',

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
  'postgresql':       '#2DD4C8',
  'postgres':         '#2DD4C8',
  'mysql':            '#2DD4C8',
  'mongodb':          '#2DD4C8',
  'sqlite':           '#2DD4C8',
  'postgis':          '#2DD4C8',
  'pgvector':         '#2DD4C8',
  'etl':              '#2DD4C8',
  'pgadmin 4':        '#2DD4C8',
  'pgadmin':          '#2DD4C8',
  'active directory': '#2DD4C8',
  'cisco amp':        '#2DD4C8',
  'microsoft defender': '#2DD4C8',

  // ── Microsoft ──────────────────────────────────────────
  'azure ai':       '#F472B6',
  'copilot studio': '#F472B6',
  'power automate': '#F472B6',
  'power bi':       '#F472B6',
  'm365':           '#F472B6',
  'sharepoint':     '#F472B6',
};

export function resolveSkillColor(skill: string): string | undefined {
  return SKILL_COLORS[skill.trim().toLowerCase()];
}