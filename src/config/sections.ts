import { LucideIcon, Code, BookOpen, Terminal, Layout, Puzzle } from "lucide-react";

export interface Section {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
}

export const sections: Section[] = [
  {
    id: "implementation",
    title: "Implementation",
    description: "Coding implementation challenges for frontend interviews",
    icon: Code,
    path: "/implementation",
  },
  {
    id: "polyfills",
    title: "Polyfills",
    description: "Hierarchical view of JavaScript polyfill implementations",
    icon: Puzzle,
    path: "/polyfills",
  },
  {
    id: "theory",
    title: "Theory",
    description: "Theoretical concepts for frontend interviews",
    icon: BookOpen,
    path: "/theory",
  },
  {
    id: "output-based",
    title: "Output Based",
    description: "Output based questions for frontend interviews",
    icon: Terminal,
    path: "/output-based",
  },
  {
    id: "frontend-system-design",
    title: "Frontend System Design",
    description: "System design concepts for frontend interviews",
    icon: Layout,
    path: "/frontend-system-design",
  },
];
