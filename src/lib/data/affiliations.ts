// Professional affiliations - extracted verbatim from the original Skills section.

export interface Affiliation {
  name: string;
  role: string;
  color: string;
  short: string;
  desc: string;
  images: string[];
  imgFit: 'cover' | 'contain';
  imgPos: string;
  ratio: string;
}

export const affiliations: Affiliation[] = [
  {
    name: 'IEEE & AESS',
    role: 'Member',
    color: '#2dd4bf',
    short: 'Institute of Electrical & Electronics Engineers / Aerospace & Electronic Systems Society',
    desc: 'Active member of IEEE and AESS. Engaged in technical communities around autonomous systems, AI safety, and engineering standards.',
    images: ['/Images/IEEE.jpg', '/Images/aess.jpg'],
    imgFit: 'contain',
    imgPos: 'center',
    ratio: '4/3',
  },
  {
    name: 'AIChE / Chem-E Car',
    role: 'Team Member & Competitor',
    color: '#f0823c',
    short: 'American Institute of Chemical Engineers - University of Toledo Chapter',
    desc: 'Competed on the UT AIChE Chem-E Car team. Contributed to Arduino-based automation integrating pressure sensors, load cells, and stopping algorithms. Won Most Innovative Car Design worldwide.',
    images: ['/Images/AIChE.jpg', '/Images/AIChE%20ChemECar_International.jpg'],
    imgFit: 'cover',
    imgPos: 'center',
    ratio: '4/3',
  },
  {
    name: 'Pi Sigma Epsilon',
    role: 'Member',
    color: '#a78bfa',
    short: 'National Co-Educational Professional Fraternity - Sales, Marketing & Management',
    desc: 'Member of Pi Sigma Epsilon, the only national professional co-educational fraternity in sales, marketing, and management.',
    images: ['/Images/PSE_1.jpg', '/Images/PSE_2.jpg', '/Images/PSE_3.jpg'],
    imgFit: 'contain',
    imgPos: 'center',
    ratio: '3/4',
  },
  {
    name: 'Toledo Athletics',
    role: 'Data Science Intern',
    color: '#2dd4bf',
    short: 'University of Toledo Department of Athletics',
    desc: 'Embedded within UT Athletics as a Sports Analytics & Data Science Intern. Featured in official UToledo Rockets media for bridging technical modeling with direct communication to athletics leadership.',
    images: ['/Images/Sport Analytics Intern Image 2026.jpg', '/Images/athletics_group_pics.png'],
    imgFit: 'cover',
    imgPos: 'top',
    ratio: '16/9',
  },
];
