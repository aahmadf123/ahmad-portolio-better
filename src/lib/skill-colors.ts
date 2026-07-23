export const SKILL_COLOR_PALETTE = {
  amber:  'var(--gold)',
  blue:   'var(--blue)',
  teal:   'var(--primary)',
  orange: 'var(--orange)',
  purple: 'var(--purple)',
  pink:   'var(--pink)',
  sky:    'var(--sky)',
  green:  '#22C55E',
  red:    'var(--red)',
} as const;

/**
 * Single authority for the 7 skill-group hues. The constellation nodes, the
 * legend chips, the radial cards and the fallback list all resolve their color
 * from here (via `skillGroups[i].color`), so the graph and every chip agree.
 * Seven separated hues - no two are confusable at a glance.
 */
export const SKILL_GROUP_COLORS: Record<string, string> = {
  'languages':  'var(--gold)', // amber
  'ml-ai':      'var(--blue)', // blue
  'mlops-data': 'var(--red)', // red
  'robotics':   'var(--purple)', // purple
  'web-edge':   '#22C55E', // green
  'databases':  'var(--primary)', // teal
  'microsoft':  'var(--pink)', // pink
};

// Plain object - keys are lowercase, values are hex colors
const SKILL_COLORS: Record<string, string> = {
  // ── Languages ──────────────────────────────────────────
  'python':        'var(--gold)',
  'javascript':    'var(--gold)',
  'typescript':    'var(--gold)',
  'c++':           'var(--gold)',
  'java':          'var(--gold)',
  'sql':           'var(--gold)',
  'html/css':      'var(--gold)',
  'embedded c':    'var(--gold)',
  'matlab':        'var(--gold)',
  'simulink':      'var(--gold)',
  'bash':          'var(--gold)',

  // ── ML & AI ────────────────────────────────────────────
  'pytorch':           'var(--blue)',
  'tensorflow':        'var(--blue)',
  'scikit-learn':      'var(--blue)',
  'rl':                'var(--blue)',
  'maml':              'var(--blue)',
  'gnns':              'var(--blue)',
  'gnn/gat':           'var(--blue)',
  'ppo':               'var(--blue)',
  'stable-baselines3': 'var(--blue)',
  'gym':               'var(--blue)',
  'meta-learning':     'var(--blue)',
  'nlp':               'var(--blue)',
  'computer vision':   'var(--blue)',
  'distilbert':        'var(--blue)',
  'gemini ai':         'var(--blue)',
  'graph-based rl':    'var(--blue)',
  'q-prop':            'var(--blue)',
  'shap':              'var(--blue)',
  'shap/lime':         'var(--blue)',
  'rf-detr':           'var(--blue)',
  'xgboost':           'var(--blue)',
  'pinn':              'var(--blue)',
  'taxonomy design':   'var(--blue)',
  'literature review': 'var(--blue)',
  'ai safety':         'var(--blue)',

  // ── MLOps & Data ───────────────────────────────────────
  'airflow':        'var(--red)',
  'mlflow':         'var(--red)',
  'pandas':         'var(--red)',
  'numpy':          'var(--red)',
  'aws':            'var(--red)',
  'aws s3':         'var(--red)',
  'aws ec2':        'var(--red)',
  'aws s3/ec2':     'var(--red)',
  'docker':         'var(--red)',
  'git':            'var(--red)',
  'github actions': 'var(--red)',
  'ci/cd':          'var(--red)',
  'linux':          'var(--red)',
  'pandera':        'var(--red)',
  'prometheus':     'var(--red)',
  'hyperopt':       'var(--red)',
  'domo':           'var(--red)',
  'slack api':      'var(--red)',

  // ── Robotics & Embedded ────────────────────────────────
  'ros 2':           'var(--purple)',
  'gazebo':          'var(--purple)',
  'gazebo fortress': 'var(--purple)',
  'ardupilot':       'var(--purple)',
  'opencv':          'var(--purple)',
  'yolo11':          'var(--purple)',
  'yolo':            'var(--purple)',
  'nvidia jetson':   'var(--purple)',
  'jetson orrin nx': 'var(--purple)',
  'jetson orin nx':  'var(--purple)',
  'sensor fusion':   'var(--purple)',
  'vins-mono':       'var(--purple)',
  'hitl':            'var(--purple)',
  'airsim':          'var(--purple)',
  'oak-d pro':       'var(--purple)',
  'slamtec c1':      'var(--purple)',
  'x500 urdf':       'var(--purple)',
  'bytetrack':       'var(--purple)',
  'bot-sort':        'var(--purple)',
  'rtmpose':         'var(--purple)',
  'cuda':            'var(--purple)',
  'arduino':         'var(--purple)',
  'pressure sensing':'var(--purple)',
  'solenoid control':'var(--purple)',
  'calibration':     'var(--purple)',

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
  'postgresql':       'var(--primary)',
  'postgres':         'var(--primary)',
  'mysql':            'var(--primary)',
  'mongodb':          'var(--primary)',
  'sqlite':           'var(--primary)',
  'postgis':          'var(--primary)',
  'pgvector':         'var(--primary)',
  'etl':              'var(--primary)',
  'pgadmin 4':        'var(--primary)',
  'pgadmin':          'var(--primary)',
  'active directory': 'var(--primary)',
  'cisco amp':        'var(--primary)',
  'microsoft defender': 'var(--primary)',

  // ── Microsoft ──────────────────────────────────────────
  'azure ai':       'var(--pink)',
  'copilot studio': 'var(--pink)',
  'power automate': 'var(--pink)',
  'power bi':       'var(--pink)',
  'm365':           'var(--pink)',
  'sharepoint':     'var(--pink)',
};

export function resolveSkillColor(skill: string): string | undefined {
  return SKILL_COLORS[skill.trim().toLowerCase()];
}
