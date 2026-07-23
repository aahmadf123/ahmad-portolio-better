// "Now" status - extracted verbatim from the original Now section.
// Ahmad: edit this file (and site.ts nowPlaying) to refresh the Now section,
// the Now Playing bar, and the learning marquee in one pass.
// The "Pursuing" card's items are sourced from certPursuits in certs.ts -
// edit that file to update in-progress certifications everywhere they appear.

import { certPursuits } from './certs';

export interface NowItem {
  title: string;
  sub: string;
}

export interface NowCard {
  icon: string;
  category: 'Learning' | 'Building' | 'Pursuing';
  status: string;
  statusColor: string;
  color: string;
  items: NowItem[];
}

export const nowUpdated = 'June 2026';

export const nowCards: NowCard[] = [
  {
    icon: '◎',
    category: 'Learning',
    status: 'In Progress',
    statusColor: '#5b8af5',
    color: '#5b8af5',
    items: [
      { title: 'Become an Application Integration Professional', sub: 'Oracle · OCI Application Integration' },
      { title: 'Drive AI Transformation in Your Organization', sub: 'Microsoft · Course AB-731T00-A' },
    ],
  },
  {
    icon: '◇',
    category: 'Building',
    status: 'Active',
    statusColor: '#2dd4bf',
    color: '#a78bfa',
    items: [
      { title: 'Student Athlete Health Insurance Site', sub: 'Toledo Athletics' },
      { title: 'Athletics Onboarding Website', sub: 'Toledo Athletics' },
      { title: 'Football Performance Metrics: CV Model', sub: 'Computer Vision · In progress' },
    ],
  },
  {
    icon: '◎',
    category: 'Pursuing',
    status: 'Upcoming',
    statusColor: '#f0823c',
    color: '#f0823c',
    items: certPursuits,
  },
];

