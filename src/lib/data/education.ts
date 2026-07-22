// Education - extracted verbatim from the original About section.

export interface Education {
  school: string;
  degree: string;
  period: string;
  status: string;
  gpa: string;
  coursework: string[];
  startDate: string;
  endDate: string;
  degreeUrl: string;
}

export const education: Education = {
  school: 'University of Toledo',
  degree: 'B.S. Computer Science & Engineering',
  period: '2021 – 2026',
  status: 'Graduated',
  gpa: '3.23',
  coursework: ['Machine Learning', 'Neural Networks', 'Databases', 'Software Eng.', 'Embedded Systems'],
  startDate: '2021-08',
  endDate: '2026-05',
  degreeUrl: '/docs/CeD.26D8-NDTX-AGEW.pdf',
};
