// Awards & recognition — extracted verbatim from the original Skills section.

export interface Award {
  title: string;
  detail: string;
  date: string;
  color: string;
  images: string[];
  imgFit: 'cover' | 'contain';
  imgPos: string;
  ratio: string;
  /** ISO yyyy-mm, for timeline placement. */
  startDate: string;
  /** Gold milestone treatment on the timeline. */
  milestone?: boolean;
}

export const awards: Award[] = [
  {
    title: 'AIChE Chem E Car Poster & Presentation',
    detail: 'AIChE · Worldwide',
    date: 'Nov 2025',
    color: '#5b8af5',
    images: ['/Images/AIChE.jpg'],
    imgFit: 'cover',
    imgPos: 'center',
    ratio: '4/3',
    startDate: '2025-11',
  },
  {
    title: 'Most Innovative Car Design',
    detail: 'AIChE Chem-E Car · Worldwide',
    date: 'Nov 2025',
    color: '#5b8af5',
    images: ['/Images/AIChE%20ChemECar_International.jpg', '/Images/AIChE.jpg'],
    imgFit: 'cover',
    imgPos: 'center',
    ratio: '4/3',
    startDate: '2025-11',
    milestone: true,
  },
  {
    title: 'USRCAP Research Fellowship',
    detail: '$3,000 · Graph-Based RL UAV Research',
    date: 'May 2025',
    color: '#f59e0b',
    images: ['/Images/graph_RL.png'],
    imgFit: 'contain',
    imgPos: 'center',
    ratio: '4/3',
    startDate: '2025-05',
    milestone: true,
  },
  {
    title: 'AIChE Chem E Car – Regional',
    detail: '3rd Place · AIChE Regional',
    date: 'Mar 2025',
    color: '#f0823c',
    images: ['/Images/AIChE_Regional_Pics.jpg'],
    imgFit: 'cover',
    imgPos: 'center',
    ratio: '16/9',
    startDate: '2025-03',
  },
  {
    title: 'Best Use of MongoDB Atlas',
    detail: 'RocketHacks 2025 · Deep Truth',
    date: 'Mar 2025',
    color: '#f0823c',
    images: ['/Images/DeepTruth_Group.png'],
    imgFit: 'cover',
    imgPos: 'top',
    ratio: '16/9',
    startDate: '2025-03',
    milestone: true,
  },
];
