import type { LucideIcon } from 'lucide-react';
import { CalendarDays, ClipboardCheck, FileText, Layers, Sparkles } from 'lucide-react';

export interface Innovation {
  icon: LucideIcon;
  tag: string;
  title: string;
  body: string;
}

export const INNOVATIONS: Innovation[] = [
  {
    icon: Layers,
    tag: 'Simulation',
    title: 'Organizational Behaviour Simulation',
    body: 'Students take on management roles and work through decisions across multiple rounds, turning abstract concepts into lived, decision-driven experience.',
  },
  {
    icon: ClipboardCheck,
    tag: 'System',
    title: 'Attendance System',
    body: 'A clean digital record across sections, signed into with students’ own university accounts — replacing manual registers.',
  },
  {
    icon: FileText,
    tag: 'System',
    title: 'Examination Paper Portal',
    body: 'Manages question papers from submission to secure storage, organized and safely held until they are needed.',
  },
  {
    icon: CalendarDays,
    tag: 'Tool',
    title: 'Timetable Maker',
    body: 'Assembles and manages teaching timetables, reducing a fiddly manual task to a few guided steps.',
  },
  {
    icon: Sparkles,
    tag: 'AI',
    title: 'AI-Assisted Evaluation',
    body: 'Applies structured rubrics to score student answers consistently, while keeping final judgment with the teacher.',
  },
];
