export interface PortalTool {
  title: string;
  body: string;
  url: string;
}

// Replace each '#' with the deployed Apps Script web-app URL (access-restricted to your students).
export const PORTAL_TOOLS: PortalTool[] = [
  { title: 'Simulations', body: 'Launch the organizational behaviour simulation.', url: 'https://rksingh-simulation.vercel.app/' },
  { title: 'Attendance', body: 'Mark and view your attendance.', url: '' },
];
