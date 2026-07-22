// Press / Featured In - extracted verbatim from the original FeaturedIn section.

export interface PressFeature {
  outlet: string;
  headline: string;
  date: string;
  summary: string;
  url: string;
  image: string;
  imageAlt: string;
}

export const press: PressFeature[] = [
  {
    outlet: 'UToledo Rockets',
    headline: 'Toledo Athletics Data Internship Program Aids The Rockets, Spurs Student Careers',
    date: 'April 20, 2026',
    summary:
      'Featured for describing the goal of becoming an AI Engineer who builds end-to-end data systems that drive real decisions at scale, and how the internship bridged technical modeling work with direct communication to athletics leadership.',
    url: 'https://utrockets.com/news/2026/4/20/toledo-athletics-data-internship-program-aids-the-rockets-spurs-student-careers.aspx',
    image: '/Images/athletics_group_pics.png',
    imageAlt: 'UToledo Athletics feature',
  },
];
