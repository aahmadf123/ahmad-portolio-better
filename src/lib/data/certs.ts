// Certifications - extracted verbatim from the original Skills section.
// NOTE: these are the only certifications that exist. There is no IBM certification;
// the AI assistant's system prompt asserts this explicitly.

export interface Cert {
  id: string;
  issuer: string;
  track: string;
  title: string;
  description: string;
  skills: string[];
  badgeImage: string;
  verifyUrl?: string;
  certificateUrl?: string;
  color: string;
  earned: string;
}

export interface CertPursuit {
  title: string;
  sub: string;
}

export const certs: Cert[] = [
  {
    id: 'oci-foundations',
    issuer: 'Oracle',
    track: 'Cloud Infrastructure',
    title: 'Cloud Infrastructure Foundations Associate',
    description:
      'Foundational knowledge of Oracle Cloud Infrastructure (OCI) core services - compute, storage, networking, identity and access management, security, pricing, and the OCI architecture model.',
    skills: ['OCI', 'Cloud Computing', 'IAM', 'Networking', 'Cloud Security'],
    badgeImage: '/Images/Oracle_Foundation_Badge.jpg',
    verifyUrl:
      'https://catalog-education.oracle.com/ords/certview/sharebadge?id=FD6DAFE9CD1BB5971BDD46D7138EF1789ACED34BB47B6CE5764199FFF18FD6DC',
    certificateUrl: '/docs/Oracle_Foundation_eCertificate.pdf',
    color: '#f0823c',
    earned: '2026',
  },
  {
    id: 'black-opal-introduction',
    issuer: 'Q-CTRL Black Opal',
    track: 'Quantum Computing',
    title: 'Introduction',
    description:
      "An introduction to quantum technology and how it works. Covers what quantum computing is, how quantum computers work, whether they'll break the internet, how to build one, and a foundational analogy toolbox.",
    skills: ['Quantum Computing', 'Fundamentals', 'Quantum Hardware'],
    badgeImage: '/Images/BlackOpal_IntroductionBadge.png',
    verifyUrl: 'https://black.q-ctrl.com/badge/df0a24e3-c81f-4696-b879-860c7b777fb3',
    color: '#a78bfa',
    earned: '2026',
  },
  {
    id: 'black-opal-superposition',
    issuer: 'Q-CTRL Black Opal',
    track: 'Quantum Computing',
    title: 'Superposition',
    description:
      "The superposition principle - where it comes from, why it's necessary, and what you can do with it. Covers superposition in waves, in the quantum world, in the abstract, and its role in quantum computing.",
    skills: ['Quantum Computing', 'Qubits', 'Superposition', 'Quantum Circuits'],
    badgeImage: '/Images/BlackOpal_SuperpositionBadge.png',
    verifyUrl: 'https://black.q-ctrl.com/badge/70fdb1da-8ba7-40ea-ad6b-2460f7542376',
    color: '#a78bfa',
    earned: '2026',
  },
];

/** In-progress certifications - feed the Now section. */
export const certPursuits: CertPursuit[] = [
  { title: 'OCI Certified Application Integration Professional', sub: 'Oracle · Exam 1Z0-1042-26' },
  { title: 'Microsoft Certified: AI Transformation Leader', sub: 'Exam prep underway' },
];
