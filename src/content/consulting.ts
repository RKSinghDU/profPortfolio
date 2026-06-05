export interface ConsultingOffering {
  title: string;
  body: string;
  highlighted?: boolean;
}

export const CONSULTING: ConsultingOffering[] = [
  {
    title: 'Organization Development & Change',
    body: 'Diagnosis, design, and facilitation of OD and change initiatives for organizations navigating structural and cultural transition. Past clients include Vedanta-BALCO, SAIL, GAIL, NHPC, IFFCO, and JK Cement. Draws on both contemporary OD frameworks and Indian managerial traditions, including values-based leadership and organizational spirituality.',
  },
  {
    title: 'Teaching–Learning Process Design',
    body: 'Design and delivery of experiential, simulation-based, and active-learning programs for academic institutions and corporate training contexts. Includes multi-round management simulations, participant-centered pedagogy, and assessment systems that are fair, rigorous, and scalable.',
  },
  {
    title: 'HR & Leadership Solutions',
    body: 'Leadership development, behavioral interventions, and people-process design for organizations seeking sustained high performance. Programs delivered for Chief Engineers of MES, senior officers of Punjab Police, IFS officers at FRI Dehradun, and corporate executives across sectors, including energy, steel, and infrastructure.',
  },
  {
    title: 'AI in Teaching & Learning',
    body: 'Advisory and implementation support for institutions integrating AI into teaching, assessment, and academic administration — responsibly and without displacing teacher judgment. Grounded in systems I have built and run at scale: AI-assisted evaluation, simulation-based learning, and AI-supported doctoral supervision. Not theoretical — every recommendation comes from something that has been deployed and tested.',
    highlighted: true,
  },
  {
    title: 'Assessment & Evaluation Systems',
    body: 'Design of rubric-based evaluation frameworks and AI-supported scoring systems for institutions managing assessment at scale. Brings consistency, transparency, and reduced evaluator fatigue — while keeping final academic judgment with the faculty.',
  },
  {
    title: 'Research Methodology & Mentoring',
    body: 'Research design, methodology workshops, and doctoral-level mentoring for scholars and faculty. Covers both quantitative and qualitative paradigms — including grounded theory and phenomenology — delivered at institutions including KIIT, DDU Gorakhpur University, Jamia Millia Islamia, Shri Ram College of Commerce, and across UGC-MMTTC Faculty Development Programs.',
  },
];

export const CONSULTING_CLIENTS =
  'Past engagements include Vedanta, BALCO, LIC, DRDO, NHPC, SAIL, GAIL, IFFCO, JK Cement, IIPA, Military Engineer Services (MES), Punjab Police, Forest Research Institute (Dehradun), KIIT, DDU Gorakhpur University, Jamia Millia Islamia, Shri Ram College of Commerce, and UGC-MMTTC Faculty Development Programs.';
