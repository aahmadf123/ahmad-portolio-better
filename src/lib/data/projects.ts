// Projects ("Bodies of Work") — extracted verbatim from the original Projects section.
// The JSX detail bodies became structured sections; every heading, paragraph, tag list,
// and link is preserved 1:1.

export interface ProjectLink {
  label: string;
  href: string;
  kind: 'case-study' | 'pdf' | 'github' | 'external' | 'video' | 'anchor';
}

export interface ProjectDetailSection {
  label: string;
  body: string;
}

export type ProjectCategory = 'autonomy' | 'ml-mlops' | 'sports' | 'web-civic' | 'embedded';

export const projectCategories: { id: ProjectCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'autonomy', label: 'Autonomy' },
  { id: 'ml-mlops', label: 'AI & MLOps' },
  { id: 'sports', label: 'Sports' },
  { id: 'web-civic', label: 'Web & Civic' },
  { id: 'embedded', label: 'Embedded' },
];

export type ProjectStatus = 'live' | 'active-build' | 'shipped' | 'research';

export const projectStatusLabel: Record<ProjectStatus, string> = {
  live: 'Live',
  'active-build': 'Active Build',
  shipped: 'Shipped',
  research: 'Research',
};

export interface Project {
  idx: string;
  /** Case-study route slug — every project has one. */
  slug?: string;
  domain: string;
  color: string;
  title: string;
  tag: string;
  /** Headline result line ("fr" in the original data). */
  headline: string;
  image: string;
  span: 1 | 2;
  stacks: string[];
  detailStacks: string[];
  detail: ProjectDetailSection[];
  links: ProjectLink[];
  category: ProjectCategory;
  status: ProjectStatus;
  flagship?: boolean;
  featuredStats?: { value: string; label: string }[];
  /** One-sentence story line for the poster card. */
  story: string;
}

export const projects: Project[] = [
  {
    idx: '01',
    slug: 'graph-based-rl-uav-autonomy',
    domain: 'Autonomy',
    color: '#f59e0b',
    title: 'Graph-Based RL for UAV Autonomy',
    tag: 'USRCAP Summer 2025 · LION Lab · $3,000',
    headline: '73% zero-shot success across 1,000+ environments',
    image: '/Images/graph_RL.png',
    span: 2,
    stacks: ['Graph-Based RL', 'MAML', 'GNN/GAT', 'PINN', 'ROS 2', 'Jetson Orin NX', 'ArduPilot', 'AirSim'],
    detailStacks: ['Graph-Based RL', 'GNN/GAT', 'MAML', 'PINN', 'Q-Prop', 'ROS 2', 'ArduPilot', 'Jetson Orin NX', 'AirSim', 'SHAP/LIME', 'OAK-D Pro', 'SLAMTEC C1'],
    detail: [
      {
        label: 'Overview',
        body: 'AeroSynapse is an edge-first UAV autonomy research framework for navigation in GPS-denied, map-free, and communication-denied environments. The system converts the local environment into a dynamic graph — obstacles, waypoints, targets, and free-space regions become nodes; spatial and risk relationships become edges. A graph-based RL policy reasons over this structure without pre-mapping or cloud inference. Across 1,000+ randomized simulation environments, the framework achieves 73% zero-shot navigation success on unseen layouts, reaching 89% after 5 episodes. The control loop runs under 20ms on a Jetson Orin NX; voice-to-action commands resolve in under 500ms.',
      },
      {
        label: 'Architecture',
        body: 'Stereo vision, LiDAR, and IMU feeds enter a PINN-based state estimator for physically consistent predictions. The environment is encoded as a real-time dynamic graph. A GNN policy with Q-Prop actor-critic selects navigation actions. MAML-style meta-learning trained across 1000+ randomized environments enables zero-shot and few-shot adaptation to unseen layouts. A safety layer with runtime assurance and control-barrier constraints governs the policy, with human-in-the-loop override via direct control, supervised autonomy, and natural-language command modes.',
      },
      {
        label: 'My Role',
        body: 'Led the full AI and autonomy architecture direction: graph-based RL framework design, zero-shot/few-shot learning methodology, PINN state estimation integration, human-in-the-loop workflow design, Jetson Orin NX edge deployment strategy, and the research framing, validation plan, and performance metrics for the USRCAP fellowship report.',
      },
      {
        label: 'Key Insight',
        body: 'Navigation is a relational problem. A flat perception model sees objects — a graph sees relationships between obstacles, goals, risk, and motion constraints. That structural representation is what makes zero-shot generalization tractable. The safety layer exists not because the policy is weak, but because a UAV autonomy system must fail safely, recover predictably, and keep humans at the right level of control.',
      },
    ],
    links: [
      { label: 'View Full Case Study', href: '/case-study/graph-based-rl-uav-autonomy', kind: 'case-study' },
      { label: 'Final Report', href: '/docs/USRCAP_Final_Report.pdf', kind: 'pdf' },
    ],
    category: 'autonomy',
    status: 'research',
    story: 'A drone that reasons over relationships, not pixels — and generalizes to worlds it has never seen.',
  },
  {
    idx: '02',
    slug: 'deepflyer-drone-reinforcement-learning',
    domain: 'Research Tools',
    color: '#5b8af5',
    title: 'DeepFlyer',
    tag: 'Educational Drone RL Platform · LION Lab',
    headline: '80% PPO success over 1M training steps; <1s Gazebo cold-start',
    image: '/Images/DeepFlyer_pics.png',
    span: 1,
    stacks: ['PPO', 'ROS 2', 'Gazebo', 'Stable-Baselines3', 'React', 'MLflow'],
    detailStacks: ['PPO', 'Stable-Baselines3', 'Gym', 'ROS 2', 'Gazebo Fortress', 'React', 'Node.js', 'Express', 'MongoDB', 'MLflow', 'X500 URDF', 'ZED Mini'],
    detail: [
      {
        label: 'Overview',
        body: 'DeepFlyer is a 3D educational drone RL platform inspired by AWS DeepRacer. Instead of racing a 2D car around a track, students train a drone in simulation to fly through hoops, avoid obstacles, and improve through reward-function design. The goal: make reinforcement learning visible — if the reward is poorly shaped, the drone behaves poorly. PPO training converges to 80% hoop-navigation success over 1M steps. Gazebo cold-starts in under 1 second, the reward API responds in under 10ms, and URDF mesh optimization reduced scene complexity by 40% without impacting physics fidelity.',
      },
      {
        label: 'Platform Stack',
        body: 'A React reward editor sits above a Node/Express backend with MongoDB session storage. Reward presets are dynamically switchable through API endpoints consumed by a Gym environment wrapper. Stable-Baselines3 runs PPO training; ROS 2 Humble + Gazebo Fortress simulate the X500 drone with validated URDF, contact sensors, and course elements. MLflow tracks every experiment run.',
      },
      {
        label: 'My Role',
        body: 'Led the RL and AI side of the platform: reward preset design, Path-Efficiency preset concept, PPO benchmarking, Gym/Stable-Baselines3 training workflow, curriculum learning strategy, and connecting the platform to broader UAV autonomy research and sim-to-real learning principles.',
      },
      {
        label: 'Key Insight',
        body: 'Reward functions are not just math — they encode behavior. A student who increases the collision penalty and watches the drone become more conservative has understood something that no lecture can teach as directly. That physical intuition is what DeepFlyer is built to create.',
      },
    ],
    links: [{ label: 'View Full Case Study', href: '/case-study/deepflyer-drone-reinforcement-learning', kind: 'case-study' }],
    category: 'autonomy',
    status: 'shipped',
    story: 'Reinforcement learning you can watch — students shape a reward and the drone shows them what they taught it.',
  },
  {
    idx: '03',
    slug: 'homeowner-loss-prediction',
    domain: 'MLOps',
    color: '#a78bfa',
    title: 'Homeowner Loss Prediction',
    tag: 'Grange Insurance × UToledo · Senior Design',
    headline: 'R² = 0.982 · 26% over GLM baseline · 75% reduction in manual review',
    image: '/Images/SeniorDesign_Pipeline.jpeg',
    span: 2,
    stacks: ['XGBoost', 'Airflow', 'MLflow', 'AWS S3/EC2', 'Pandera', 'Prometheus', 'Hyperopt', 'SHAP'],
    detailStacks: ['XGBoost', 'Hyperopt', 'Airflow', 'MLflow', 'AWS S3', 'AWS EC2', 'Pandera', 'Prometheus', 'Slack API', 'Docker', 'GitHub Actions', 'SHAP', 'scikit-learn'],
    detail: [
      {
        label: 'Overview',
        body: 'A production-grade MLOps automation pipeline built with Grange Insurance to modernize homeowner risk and pure premium predictions. The project reframed risk modeling as a continuously operating system — automating the full ML lifecycle from raw data ingestion through drift detection, model training, experiment tracking, and human-approved deployment. The XGBoost pipeline achieved R² = 0.982, outperforming the incumbent GLM baseline by 26% on holdout data (RMSE 7,216), while reducing manual actuarial review by 75%.',
      },
      {
        label: 'Problem',
        body: 'Traditional actuarial workflows depend on manual data pulls, notebook-based preprocessing, and repeated model rebuilds. Risk patterns shift faster than manual processes can adapt — claim volatility, inflation, weather events, and regional property trends all create windows where stale models drive pricing decisions.',
      },
      {
        label: 'Architecture',
        body: 'Airflow orchestrates ingestion and scheduling. Pandera validates schemas. XGBoost with Hyperopt/Bayesian optimization handles prediction across 100+ engineered features. MLflow tracks every experiment, artifact, and model version. Prometheus monitors system health. Drift detection triggers self-healing retraining workflows. Slack delivers alerts and approval requests. Human-in-the-loop gates require analyst sign-off before retraining or model promotion — automation with accountability, not without it.',
      },
      {
        label: 'My Role',
        body: 'Led MLOps architecture design, pipeline decomposition, ingestion/preprocessing modules, drift detection, schema validation, AWS infrastructure (EC2, S3, Prometheus), Airflow orchestration strategy, Slack-based human-in-the-loop workflows, testing automation, and dashboard design.',
      },
      {
        label: 'Key Insight',
        body: "The 75% reduction in manual review didn't happen because humans were removed from the workflow. It happened because the system moved humans to the right point in the loop — intervening only where judgment actually matters: drift remediation, suspicious model behavior, hyperparameter override, rollback, or production promotion.",
      },
    ],
    links: [
      { label: 'View Full Case Study', href: '/case-study/homeowner-loss-prediction', kind: 'case-study' },
      { label: 'Final Report', href: '/docs/EECS4020_FinalReport_G3.pdf', kind: 'pdf' },
      { label: 'GitHub', href: 'https://github.com/RayFrightener/ml_automation', kind: 'github' },
    ],
    category: 'ml-mlops',
    status: 'shipped',
    story: 'An insurance risk model rebuilt as a living system — one that notices when the world drifts away from it.',
  },
  {
    idx: '04',
    slug: 'security-discovery-tool',
    domain: 'Infrastructure',
    color: '#2dd4bf',
    title: 'Security Discovery Tool',
    tag: 'Park Place Technologies · AIIS Summer 2023',
    headline: '15% faster response · 95% data integrity · zero data loss across 3 sources',
    image: '/Images/sdt_tool.png',
    span: 1,
    stacks: ['PostgreSQL', 'pgAdmin', 'Active Directory', 'Cisco AMP', 'Microsoft Defender', 'SQL'],
    detailStacks: ['PostgreSQL', 'pgAdmin', 'Active Directory', 'Cisco AMP', 'Microsoft Defender', 'Data Governance', 'Disaster Recovery', 'SQL'],
    detail: [
      {
        label: 'Overview',
        body: 'Industry case study with Park Place Technologies (AIIS Summer 2023). Designed a centralized PostgreSQL security database consolidating fragmented feeds from 3 sources — Active Directory, Cisco AMP, and Microsoft Defender — enforcing validation rules, building disaster-recovery procedures, and enabling faster analyst queries. Result: 15% faster incident response, 95% improvement in data integrity, and zero data loss across all disaster-recovery tests.',
      },
      {
        label: 'My Role',
        body: 'Database engineering on the AIIS Database I team: schema design, SQL, data-integrity validation, DR simulation planning, and technical documentation.',
      },
      {
        label: 'Key Insight',
        body: "Most data-quality problems in security ops aren't adversarial — they're inconsistent tooling assumptions meeting at a shared data boundary. A validated schema is a security control.",
      },
    ],
    links: [{ label: 'View Full Case Study', href: '/case-study/security-discovery-tool', kind: 'case-study' }],
    category: 'ml-mlops',
    status: 'shipped',
    story: 'Three security tools that disagreed about reality, reconciled into one database that tells the truth.',
  },
  {
    idx: '05',
    slug: 'deeptruth-ai-fact-checking',
    domain: 'Hackathon',
    color: '#f59e0b',
    title: 'DeepTruth',
    tag: 'RocketHacks 2025 · Best Use of MongoDB Atlas',
    headline: '#1 Best Use of MongoDB Atlas · 9,500+ training points in 24 hours',
    image: '/Images/DeepTruth_Group.png',
    span: 1,
    stacks: ['Gemini AI', 'DistilBERT', 'Django', 'React', 'MongoDB', 'Chrome Extension'],
    detailStacks: ['Gemini AI', 'DistilBERT', 'Django REST', 'React', 'Vite', 'MongoDB', 'Chrome Extension', 'NLP', 'Hugging Face'],
    detail: [
      {
        label: 'What Was Built',
        body: 'Built in 24 hours at RocketHacks 2025, winning Best Use of MongoDB Atlas. A web app and Chrome extension that analyze article titles using dual-model AI across 9,500+ training data points — Gemini handles high-level reasoning and explanation, DistilBERT adds NLP classification, and a 70/30 weighted fusion produces a credibility score, veracity assessment, reasoning, and independent source links. Claims stored in MongoDB.',
      },
      {
        label: 'Key Insight',
        body: 'Credibility systems need explanations, not only scores — and multi-model architectures are more honest than trusting a single signal. The goal was never to decide truth; it was to help users ask better questions faster.',
      },
    ],
    links: [
      { label: 'View Full Case Study', href: '/case-study/deeptruth-ai-fact-checking', kind: 'case-study' },
      { label: 'GitHub', href: 'https://github.com/TheChozenWon/DeepTruth.git', kind: 'github' },
      { label: 'Watch Demo', href: 'https://youtu.be/whTYKriT5JU?si=M-0yUWXURhPrvy--', kind: 'video' },
    ],
    category: 'ml-mlops',
    status: 'shipped',
    story: 'A 24-hour build that refuses to declare truth — it hands you the evidence and better questions instead.',
  },
  {
    idx: '06',
    slug: 'camel-car-cheme-car-control-system',
    domain: 'Embedded',
    color: '#f0823c',
    title: 'Camel Car',
    tag: 'AIChE 2025 · Most Innovative Car Design · 3rd Poster · 24th Overall',
    headline: '24th overall · #1 Most Innovative · AIChE 2025 ChemE Car',
    image: '/Images/AIChE%20ChemECar_International.jpg',
    span: 1,
    stacks: ['Arduino', 'Pressure Sensing', 'Solenoid Control', 'Embedded C', 'Calibration'],
    detailStacks: ['Arduino', 'Pressure Sensing', 'Solenoid Control', 'Embedded C', 'Calibration', 'Safety Systems', 'CO₂ Propulsion'],
    detail: [
      {
        label: 'What Was Built',
        body: "University of Toledo's entry placed 24th overall at AIChE 2025 in Boston — earning Most Innovative Car Design and 3rd in Poster & Presentation nationally. CO₂ generation provides propulsion; H₂O₂ decomposition provides stopping. As Control Team Lead, I built the Arduino-based pressure-sensing and shutoff system: monitor the stopping reaction, detect the ~5 psi setpoint, trigger the solenoid to cut gas flow to the motor. Calibrated via KI volume vs. time-to-pressure experiments for the target competition distance.",
      },
      {
        label: 'Key Insight',
        body: 'The chemistry creates the signal. The control system is what turns that signal into a repeatable vehicle action. A well-calibrated threshold controller beats a complex one when variability is chemical, not electrical.',
      },
    ],
    links: [{ label: 'View Full Case Study', href: '/case-study/camel-car-cheme-car-control-system', kind: 'case-study' }],
    category: 'embedded',
    status: 'shipped',
    story: 'A car driven by chemistry and stopped by a threshold controller — innovative enough to win worldwide.',
  },
  {
    idx: '07',
    slug: 'batting-cleanup-smart-city-waste-reporting',
    domain: 'Civic Tech',
    color: '#f472b6',
    title: 'Batting Cleanup',
    tag: 'City of Toledo · Applied Labs · In Production',
    headline: 'In production: <10ms geospatial queries across 10,000+ city assets',
    image: '/Images/Batting_Cleanup.jpg',
    span: 1,
    stacks: ['Deno', 'PostGIS', 'Cloudflare Workers', 'Drizzle ORM', 'Docker', 'Hono'],
    detailStacks: ['Deno', 'PostGIS', 'Cloudflare Workers', 'Hono', 'Drizzle ORM', 'Docker', 'GiST Indexing', 'Geospatial Validation', 'Anti-Spoofing'],
    detail: [
      {
        label: 'What Was Built',
        body: 'In active production in downtown Toledo. Residents scan QR codes on public trash assets to instantly file maintenance reports. I contributed to backend architecture: modernized raw init scripts into a type-safe Deno monorepo, built PostGIS geospatial models with GiST indexing, benchmarked ST_DWithin queries to under 10ms against 10,000+ simulated localized assets, designed Docker Compose local infrastructure for the 7-person team, and implemented location-verification and anti-spoofing layers.',
      },
      {
        label: 'Key Insight',
        body: 'The hard part was not making a form. The hard part was making location-aware public reporting reliable enough for real city use — GPS noise, indoor submissions, spoofing attempts, and all.',
      },
    ],
    links: [
      { label: 'View Full Case Study', href: '/case-study/batting-cleanup-smart-city-waste-reporting', kind: 'case-study' },
      { label: 'Documentation', href: 'https://battingcleanup.appliedlabs.org/', kind: 'external' },
      { label: 'News Article', href: 'https://toledofreepress.com/batting-cleanup-aims-to-improve-toledo-maintenance-with-tech/', kind: 'external' },
    ],
    category: 'web-civic',
    status: 'live',
    story: 'Scan a QR code on a Toledo trash can, and the city hears about the problem before you walk away.',
  },
  {
    idx: '08',
    slug: 'champions-complex-digital-campaign',
    domain: 'Athletics',
    color: '#38bdf8',
    title: 'Champions Complex Digital Campaign',
    tag: 'University of Toledo Athletics · Digital Fundraising Campaign',
    headline: '74,000 sq ft · 450+ athletes · 6-stage donor psychology journey',
    image: '/Images/Champion_Complex_Render1.jpg',
    span: 2,
    stacks: ['Web Strategy', 'Sidearm Sports', 'Donor UX', 'Information Architecture', 'Digital Fundraising', 'Brand Strategy'],
    detailStacks: ['Sidearm Sports', 'Sidearm Narrator', 'Web Strategy', 'Information Architecture', 'Donor UX', 'Digital Fundraising', 'Sports Marketing', 'Brand Strategy', 'UToledo Design System', 'Naming-Rights Planning', 'Conversion Psychology'],
    detail: [
      {
        label: 'Overview',
        body: 'The Champions Complex Digital Campaign is a strategic webpage and digital fundraising blueprint for University of Toledo Athletics. The project supports the Champions Complex initiative — a 74,000-square-foot renovation of the Health Education Building that centralizes resources for 450+ student-athletes, bringing academics, nutrition, wellness, training, and team spaces under one roof while returning baseball and softball to main campus. The campaign deploys 10 architectural renderings across a six-stage donor psychology sequence built on the Sidearm Narrator platform.',
      },
      {
        label: 'My Role',
        body: 'Created the full digital campaign strategy: information architecture, scroll-based donor journey, rendering-to-section narrative mapping, Sidearm Sports / Narrator implementation planning, donation CTA flow, naming-rights structure, UToledo brand alignment, and digital donor recognition concepts. The work sits at the intersection of web development, UX, sports marketing, and donor psychology.',
      },
      {
        label: 'Digital Strategy',
        body: 'The page follows a deliberate six-stage donor psychology sequence: Awe → Understanding → Trust → Exploration → Legacy → Action. Each architectural rendering is assigned to a specific narrative section rather than a generic gallery — exterior dusk rendering opens the hero, Academic Center renders anchor the excellence section, Champions Corridor ties donor recognition to legacy. Sidearm Narrator enables the immersive single-page experience using parallax, sliders, and scroll-triggered animation within the existing athletics web ecosystem.',
      },
      {
        label: 'Key Insight',
        body: 'Capital campaign websites are conversion systems, not information pages. Donor trust is built through clarity, momentum, and proof — not renderings alone. The donation flow must be designed as carefully as the visual experience: a donor who is emotionally convinced should not have to search for the next step.',
      },
    ],
    links: [{ label: 'View Full Case Study', href: '/case-study/champions-complex-digital-campaign', kind: 'case-study' }],
    category: 'sports',
    status: 'shipped',
    story: 'Ten architectural renderings arranged into a psychological journey that ends with a donation, not a dead end.',
  },
  {
    idx: '09',
    slug: 'toledo-athletics-onboarding-portal',
    domain: 'Internal Tools',
    color: '#22c55e',
    title: 'Toledo Athletics Onboarding Portal',
    tag: 'University of Toledo Athletics · Internal Platform',
    headline: '14-table schema · serverless edge deployment across 5 service tiers',
    image: '/Images/Toledo_Athletics_Onboarding.png',
    span: 2,
    stacks: ['Cloudflare Workers', 'Hono', 'React', 'Cloudflare D1', 'Workers AI', 'TypeScript'],
    detailStacks: ['Cloudflare Workers', 'Hono', 'TypeScript', 'React', 'Cloudflare D1', 'SQLite', 'Workers AI', 'Wrangler', 'Serverless', 'Knowledge Management', 'NCAA Compliance', 'HR Onboarding'],
    detail: [
      {
        label: 'Overview',
        body: 'A serverless internal onboarding platform built for University of Toledo Athletics staff, spanning 5 core services and a 14-table relational schema. The portal centralizes 10+ onboarding content areas — articles, staff hierarchy, key contacts, HR timelines, compliance resources, systems directories, policy links, quick links, and moderated employee tips — replacing scattered documents and tribal knowledge with a single searchable source of truth, deployed at the edge via Cloudflare Workers.',
      },
      {
        label: 'Problem',
        body: 'New staff entering a Division I athletics department must simultaneously navigate university HR, NCAA compliance, Title IX, NIL rules, FERPA, IT systems, campus logistics, facilities, brand standards, and athletics-specific workflows. Without a centralized system, onboarding is inconsistent, supervisors repeat themselves, and outdated information creates operational and compliance risk.',
      },
      {
        label: 'Architecture',
        body: 'React SPA frontend → Cloudflare Worker API → Hono routes → Cloudflare D1 (SQLite relational schema) → Workers AI chat assistant. The database separates official published content from employee submissions behind a moderation layer: staff submit tips, which remain pending until a moderator approves or rejects them. This captures practical knowledge without letting unverified guidance become official policy.',
      },
      {
        label: 'My Role',
        body: 'Designed and built the full platform: onboarding content architecture, relational schema design across 14 tables, Cloudflare Workers + Hono serverless API, React SPA, Workers AI chat integration, moderated knowledge-management workflow, and a maintenance guide for future staff to update content, contacts, policies, and systems without touching the codebase.',
      },
      {
        label: 'Key Insight',
        body: 'Onboarding is a knowledge-management problem, not a documentation problem. The moderation layer matters most: athletics onboarding covers compliance topics where incorrect guidance about NCAA rules, Title IX, NIL, FERPA, or HR policy creates institutional risk. The portal captures real staff knowledge while preserving administrative control over what becomes official.',
      },
    ],
    links: [{ label: 'View Full Case Study', href: '/case-study/toledo-athletics-onboarding-portal', kind: 'case-study' }],
    category: 'sports',
    status: 'shipped',
    story: 'Tribal knowledge from a Division I athletics department, captured behind a moderation layer at the edge.',
  },
  {
    idx: '10',
    slug: 'toledo-football-iq-computer-vision-analytics',
    domain: 'Sports Analytics',
    color: '#ef4444',
    title: 'Toledo Football IQ',
    tag: 'University of Toledo Athletics · Football · Active Build',
    headline: '10-stage CV pipeline · 90%+ field-marking accuracy · 18+ structured metrics',
    image: '/Images/Football_IQ_Analytics.png',
    span: 1,
    stacks: ['YOLO', 'ByteTrack', 'RTMPose', 'FastAPI', 'React', 'Postgres', 'Cloudflare R2', 'MLflow'],
    detailStacks: ['YOLO', 'RF-DETR', 'ByteTrack', 'BoT-SORT', 'RTMPose', 'FastAPI', 'React', 'Postgres', 'pgvector', 'Cloudflare R2', 'MLflow', 'PyTorch', 'FFmpeg', 'CUDA'],
    detail: [
      {
        label: 'Overview',
        body: 'An active computer vision platform for Toledo Football — a 10-stage pipeline from video ingest to coach dashboard, targeting 90%+ field-marking accuracy across a 18+ table database schema. In Phase 0, the system works through 50–100 annotated evaluation clips to validate each pipeline stage before advancing. Every output connects to the exact clip, overlay, confidence score, and correction path. If a coach cannot verify it, correct it, and teach from it — it is not a production metric.',
      },
      {
        label: 'Problem',
        body: 'Raw practice film is time-consuming to review. Coaches manually tag plays, identify formations, evaluate routes, track effort, and create cutups. Commercial tools provide generic AI tagging, but Toledo can build a local advantage through overhead drone footage, Toledo-specific terminology, a coach-correction flywheel, and integration with athlete-development workflows.',
      },
      {
        label: '10-Stage CV Pipeline',
        body: 'Video ingest → play segmentation → field calibration (homography) → player detection (YOLO/RF-DETR) → tracking (ByteTrack/BoT-SORT) → Re-ID (jersey OCR + biometric priors) → event detection → football labels → metric computation → overlay rendering and dashboard indexing.',
      },
      {
        label: 'My Role',
        body: 'Designing the full system: phased roadmap, CV pipeline, database schema, dashboard surfaces, coach-correction flywheel, Toledo terminology layer, calibration confidence scoring, self-scout exposure index, pose-lite biomechanics approach, player development profiles, and same-session feedback architecture.',
      },
      {
        label: 'Key Insight',
        body: 'Correction workflows must be built before advanced models. The coach-correction flywheel — where every corrected label becomes Toledo-specific training data — is the competitive moat. Private, corrected, domain-specific data beats any off-the-shelf model at Toledo football terminology.',
      },
    ],
    links: [{ label: 'View Full Case Study', href: '/case-study/toledo-football-iq-computer-vision-analytics', kind: 'case-study' }],
    category: 'sports',
    status: 'active-build',
    flagship: true,
    featuredStats: [
      { value: '10', label: 'Pipeline stages' },
      { value: '18+', label: 'Structured metrics' },
      { value: '90%+', label: 'Field-marking accuracy' },
    ],
    story: 'Practice film becomes evidence a coach can verify, correct, and teach from — trust is the product.',
  },
];

export const flagshipProject = projects.find((p) => p.flagship)!;

/** Case-study route slugs — feeds sitemap.ts so it can never drift again. */
export const caseStudySlugs = projects.flatMap((p) => (p.slug ? [p.slug] : []));
