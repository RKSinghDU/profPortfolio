export interface PortalToolLink {
  title: string;
  body: string;
  url: string;
}

export interface PortalTool {
  title: string;
  body: string;
  url: string;
  /** Optional secondary link shown directly beneath the tool card. */
  more?: PortalToolLink;
}

// Replace each '' with the deployed Apps Script web-app URL (access-restricted to your students).
export const PORTAL_TOOLS: PortalTool[] = [
  { title: 'Pratibha Simulation', body: 'Launch the organisational behaviour simulation.', url: 'https://pratibha-simulation.vercel.app/' },
  {
    title: 'Disha Simulation',
    body: 'Launch the Disha career and decision simulation.',
    url: 'https://disha-simulation.vercel.app/',
    more: { title: 'About Project Disha', body: 'Know more about Disha', url: '/project-disha.html' },
  },
  { title: 'Attendance', body: 'Mark and view your attendance.', url: '' },
];
