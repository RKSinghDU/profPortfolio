export interface Course {
  code: string;
  title: string;
  body: string;
}

export const COURSES: Course[] = [
  {
    code: 'COMC004',
    title: 'Organizational Behaviour & Leadership',
    body: 'How individuals and groups behave within organizations, and the leadership that shapes them.',
  },
  {
    code: 'DSEH02',
    title: 'Organizational Change & Development',
    body: 'How organizations change, adapt, and develop — and the interventions that guide them.',
  },
  {
    code: 'PHDCC001',
    title: 'Research Methodology (Doctoral)',
    body: 'Research design and methodology for doctoral scholars, from philosophy of research to scholarly craft.',
  },
];
