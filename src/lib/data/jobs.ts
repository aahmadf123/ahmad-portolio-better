// Work experience - extracted verbatim from the original Experience section.
// startDate/endDate (ISO yyyy-mm) added for timeline ordering; content unchanged.

export interface Job {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Research Co-Op' | 'Industry Project' | 'Co-Op' | 'Part-time';
  active?: boolean;
  color: string;
  logo: string;
  description: string;
  achievements: string[];
  stack: string[];
  startDate: string;
  endDate?: string;
  /** Gold milestone treatment on the timeline. */
  milestone?: boolean;
}

export const jobs: Job[] = [
  {
    id: 'first-solar-dev-i',
    role: 'Developer I',
    company: 'First Solar',
    period: 'Jun 2026 – Present',
    location: 'Perrysburg, OH',
    type: 'Full-time',
    active: true,
    color: '#f59e0b',
    logo: '/Images/first%20solar_logo.png',
    description:
      "Develops and supports First Solar's Enterprise Applications based on Oracle technologies. Builds and maintains Oracle Cloud applications using Visual Builder (VBCS), Oracle Integration Cloud (OIC), and Oracle BI Publisher Reports (BIP). Designs and implements application components, REST API integrations, and web services. Conducts unit and system testing, participates in code reviews, maintains coding standards, and collaborates with cross-functional teams and senior architects to deliver high-quality enterprise software solutions.",
    achievements: [
      'Oracle Cloud VBCS & OIC development',
      'REST API & web service integrations',
      'Enterprise application deployment pipelines',
      'Cross-team Oracle stack collaboration',
    ],
    stack: ['Oracle Cloud', 'VBCS', 'OIC', 'BIP', 'PL/SQL', 'JavaScript', 'HTML/CSS', 'REST APIs', 'Git'],
    startDate: '2026-06',
    milestone: true,
  },
  {
    id: 'toledo-athletics-intern',
    role: 'Sports Analytics & Data Science Intern',
    company: 'Toledo Athletics',
    period: 'Oct 2025 – Present',
    location: 'Toledo, OH',
    type: 'Internship',
    active: true,
    color: '#2dd4bf',
    logo: '/Images/Primary_Logo_for_Dark_Background.png',
    description:
      'Collaborate with Athletics Directors and Coaches to develop ML-Powered analytics solutions for athletic performance improvement. Developed statistical models for evaluating roster efficiency and optimizing student-athlete benefit allocation. Created DOMO dashboards translating complex data into actionable insights for coaches and administrators. Facilitated onboarding and technical training for incoming interns.',
    achievements: [
      'ML-powered roster efficiency models',
      'DOMO dashboards for coaches & admins',
      'Onboarded & trained incoming interns',
      'Featured in official UToledo Rockets media',
    ],
    stack: ['Python', 'scikit-learn', 'DOMO', 'Statistical Modeling', 'ML'],
    startDate: '2025-10',
  },
  {
    id: 'first-solar-ms-dev',
    role: 'Microsoft Solution Developer',
    company: 'First Solar',
    period: 'Jan 2026 – May 2026',
    location: 'Perrysburg, OH',
    type: 'Internship',
    color: '#f59e0b',
    logo: '/Images/first%20solar_logo.png',
    description:
      'Functioned as an AI Engineer & Data Engineer, delivering AI solutions within Microsoft for the Business. Developed and tested automated workflows using Power Automate. Integrated Azure AI services into Microsoft 365 applications for enhanced functionality. Spearheaded project workflows for a team of two additional interns, coordinating contributions to meet critical milestones. Created connectors and scripts to support enterprise-level automation.',
    achievements: [
      'Agentic AI solutions in Copilot Studio',
      'Automated Power Automate workflows',
      'Led intern team across project milestones',
      'Azure AI × M365 enterprise integration',
    ],
    stack: ['Copilot Studio', 'Azure AI', 'Power Automate', 'M365', 'Python'],
    startDate: '2026-01',
    endDate: '2026-05',
  },
  {
    id: 'lion-lab-researcher',
    role: 'Undergraduate Researcher',
    company: 'LION Lab · CPHS Lab',
    period: 'May – Dec 2025',
    location: 'University of Toledo',
    type: 'Research Co-Op',
    color: '#5b8af5',
    logo: '/Images/VERT%20UToledo%20Logos%202019%20OL_RGB_VERT%20Reverse.png',
    description:
      'Led research on next-generation drone autonomy integrating Graph-Based Reinforcement Learning, Visual-Inertial Odometry, UWB, and real-time Human-in-the-Loop collaboration for indoor/outdoor GPS-denied navigation. Built GNN/GAT with PPO/SAC algorithms and MAML meta-learning for rapid policy adaptation. Designed AWS DeepRacer-inspired interface for real-time reward shaping. Authored ACM CSUR survey paper on AI failure taxonomy.',
    achievements: [
      '72.8% zero-shot UAV deployment via MAML',
      '97.3% HITL success at sub-100ms',
      'ACM CSUR survey paper (under review)',
      'USRCAP $3,000 fellowship',
    ],
    stack: ['PyTorch', 'ROS 2', 'MAML', 'YOLO11', 'AirSim', 'NVIDIA Jetson', 'GNN/GAT'],
    startDate: '2025-05',
    endDate: '2025-12',
    milestone: true,
  },
  {
    id: 'grange-senior-design',
    role: 'Senior Design Team Lead',
    company: 'Grange Insurance × UToledo',
    period: 'Aug 2024 – May 2025',
    location: 'Toledo, OH',
    type: 'Industry Project',
    color: '#a78bfa',
    logo: '/Images/grange_insurance_logo.png',
    description:
      'Led interdisciplinary team delivering a production-grade MLOps insurance risk model. Designed Airflow + MLflow pipeline with drift monitoring and HITL gates - automating the full ML lifecycle from data ingestion through deployment. Achieved R² = 0.982, outperforming the GLM baseline by 26%, while reducing manual actuarial review by 75%.',
    achievements: [
      'R² = 0.982 · 26% over GLM baseline',
      '75% reduction in manual review',
      'Airflow + MLflow full MLOps pipeline',
      'AWS S3/EC2 production infrastructure',
    ],
    stack: ['XGBoost', 'Airflow', 'MLflow', 'AWS S3/EC2', 'Bayesian Opt.', 'SHAP', 'Docker'],
    startDate: '2024-08',
    endDate: '2025-05',
  },
  {
    id: 'park-place-coop',
    role: 'Database Engineer Co-Op',
    company: 'Park Place Technologies',
    period: 'May – Aug 2023',
    location: 'Toledo, OH',
    type: 'Co-Op',
    color: '#f0823c',
    logo: '/Images/park%20place_logo.png',
    description:
      'Architected and implemented a data governance framework consolidating security data from Active Directory, Cisco AMP, and Microsoft Defender into a centralized PostgreSQL database. Implemented validation rules catching 95% of non-compliant entries during ingestion. Revamped disaster recovery protocol - achieving zero data loss across all quarterly DR simulations.',
    achievements: [
      '15% faster incident response',
      '95% data integrity rate',
      'Zero data loss across all DR tests',
      '3 enterprise security sources unified',
    ],
    stack: ['PostgreSQL', 'pgAdmin', 'Active Directory', 'Cisco AMP', 'Data Governance', 'SQL'],
    startDate: '2023-05',
    endDate: '2023-08',
  },
  {
    id: 'utoledo-it-assistant',
    role: 'IT Student Assistant',
    company: 'The University of Toledo',
    period: 'Oct 2022 – Feb 2023',
    location: 'Toledo, OH',
    type: 'Part-time',
    color: '#22c55e',
    logo: '/Images/VERT%20UToledo%20Logos%202019%20OL_RGB_VERT%20Reverse.png',
    description:
      'Resolved 60% of recurring IT issues by streamlining account troubleshooting for students and medical staff. Achieved 100% compliance with FERPA and HIPAA guidelines while handling sensitive data across platforms. Revamped the account access troubleshooting system by authoring detailed guides that slashed repeat issues by 40%. Delivered cross-platform support for students, faculty, patients, and Doctors.',
    achievements: [
      '60% fewer recurring IT issues',
      '100% FERPA & HIPAA compliance',
      '40% reduction in repeat incidents',
      'Cross-platform support: students & medical staff',
    ],
    stack: ['IT Support', 'FERPA', 'HIPAA', 'Troubleshooting', 'Documentation'],
    startDate: '2022-10',
    endDate: '2023-02',
  },
];

