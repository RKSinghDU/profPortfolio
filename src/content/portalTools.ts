export interface PortalTool {
  title: string;
  body: string;
  url: string;
  /** Set true for pages that are open to everyone (no institutional sign-in needed). */
  openAccess?: boolean;
}

// Replace each '' with the deployed Apps Script web-app URL (access-restricted to your students).
export const PORTAL_TOOLS: PortalTool[] = [
  { title: 'Pratibha Simulation', body: 'Launch the organisational behaviour simulation.', url: 'https://pratibha-simulation.vercel.app/' },
  { title: 'Disha Simulation', body: 'Launch the Disha career and decision simulation.', url: 'https://disha-simulation.vercel.app/' },
  { title: 'About Project Disha', body: 'What the six-round simulation is, and how it is played.', url: '/project-disha.html', openAccess: true },
  { title: 'Attendance', body: 'Mark and view your attendance.', url: '' },
];
