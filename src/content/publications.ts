export interface Publication {
  title: string;
  venue: string;
  year: number | string;
  doi?: string;
}

export const JOURNAL_ARTICLES: Publication[] = [
  {
    title:
      'Generative AI as a Catalyst: How Flexible Management Practices Drive Frugal Innovation in Resource-Constrained Environments',
    venue: 'Global Journal of Flexible Systems Management',
    year: 2026,
    doi: 'https://doi.org/10.1007/s40171-026-00480-4',
  },
  {
    title: 'The Deep Approach to Learning as a Measure of Quality Education in Accreditation',
    venue: 'Quality Assurance in Education',
    year: 2025,
    doi: 'https://doi.org/10.1108/QAE-04-2025-0088',
  },
  {
    title:
      'Adoption of HR Analytics for Future-Proof Decision Making: Role of Attitude toward Artificial Intelligence as a Moderator',
    venue: 'International Journal of Organizational Analysis, 33(9), 3047–3063',
    year: 2024,
    doi: 'https://doi.org/10.1108/IJOA-03-2024-4392',
  },
  {
    title:
      'Quality of Teaching & Learning in Higher Education: A Bibliometric Review & Future Research Agenda',
    venue: 'On the Horizon: The International Journal of Learning Futures, 32(4), 149–158',
    year: 2024,
    doi: 'https://doi.org/10.1108/OTH-06-2023-0025',
  },
  {
    title:
      'Workplace spirituality and organizational effectiveness: exploration of relationship and moderators',
    venue: 'Journal of Management, Spirituality & Religion, 18(1), 15–35',
    year: 2021,
    doi: 'https://doi.org/10.1080/14766086.2020.1829011',
  },
];

export interface EditorialBoard {
  journal: string;
  publisher: string;
}

export const EDITORIAL_BOARDS: EditorialBoard[] = [
  { journal: 'Journal of Business Ethics', publisher: 'Wiley' },
  { journal: 'Management Decision', publisher: 'Emerald' },
  { journal: 'International Journal of Organizational Analysis', publisher: 'Emerald' },
  { journal: 'Journal of Organizational Effectiveness: People and Performance', publisher: 'Emerald' },
  { journal: 'Journal of Management, Spirituality & Religion', publisher: 'Taylor & Francis' },
  { journal: 'Journal of Organizational Change Management', publisher: 'Emerald' },
  { journal: 'On the Horizon: The International Journal of Learning Futures', publisher: 'Emerald' },
  { journal: 'Quality Assurance in Education', publisher: 'Emerald' },
  { journal: 'Journal of Religion & Health', publisher: 'Springer' },
  { journal: 'Evidence-Based HRM', publisher: 'Emerald' },
  { journal: 'Business Analyst', publisher: 'Former Editor' },
];
