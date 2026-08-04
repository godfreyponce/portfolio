import type { MediaItem } from "@/components/ui/MediaCarousel";
import type { BadgeTone } from "@/components/ui/Badge";

export interface Project {
  title: string;
  description: string;
  /** Hand-written one-liner for /projects index rows; full description shows expanded (#30). */
  shortDesc: string;
  /** Hand-picked for the homepage Lab stack, 4-6 max (#30). */
  featured?: boolean;
  tags: string[];
  status: Exclude<BadgeTone, "neutral">;
  date?: string;
  link?: string;
  githubLink?: string;
  devpostLink?: string;
  videoUrl?: string;
  media?: MediaItem[];
  iconSrc?: string;
  iconLucide?: "radio" | "timer" | "eye" | "server" | "brain" | "dollar" | "rocket";
  color?: string;
}

// Brand marks in public/tech (FAISS uses the Meta mark; Nebula API is the UTD Nebula app-icon, Plaid the official lattice)
export const techIcons: Record<string, string> = {
  Gemini: "/tech/gemini.svg",
  ElevenLabs: "/tech/elevenlabs.svg",
  "Nebula API": "/tech/nebula.png",
  FAISS: "/tech/meta.svg",
  HuggingFace: "/tech/huggingface.svg",
  LangChain: "/tech/langchain.svg",
  Plaid: "/tech/plaid.svg",
  Twilio: "/tech/twilio.svg",
  Auth0: "/tech/auth0.svg",
  SwiftUI: "/tech/swift.svg",
  Figma: "/tech/figma.svg",
};

export const projects: Project[] = [
  {
    title: "CometAdvisor",
    description:
      "Upload your transcript, talk to an AI advisor, and get a personalized semester plan — what to take, who to take it with, and why.",
    shortDesc: "An AI advisor that turns your transcript into a semester plan.",
    featured: true,
    tags: ["ElevenLabs", "Nebula API", "Gemini"],
    status: "hackathon",
    date: "March 2026",
    githubLink: "https://github.com/godfreyponce/hackai-26/tree/main",
    devpostLink: "https://devpost.com/software/untitled-project-h2z8qftmvkj9",
    link: "https://www.youtube.com/watch?v=T0LmM8ngKk4",
    color: "bg-violet-50",
    iconSrc: "/projects/cometadvisor/LOGO.png",
    media: [
      { type: "image", src: "/projects/cometadvisor/cometLogo.png", alt: "CometAdvisor — Logo" },
      { type: "image", src: "/projects/cometadvisor/comet.png", alt: "CometAdvisor — Screenshot" },
      { type: "image", src: "/projects/cometadvisor/comet-stack.png", alt: "CometAdvisor — Tech Stack", fit: "contain" },
    ],
  },
  {
    title: "Remix",
    description:
      "Remix analyzes your resume and job description to surface skill gaps, then builds a personalized interview around them — so you practice what actually matters.",
    shortDesc: "Mock interviews built from your resume's actual skill gaps.",
    featured: true,
    tags: ["FAISS", "HuggingFace", "Gemini", "LangChain"],
    status: "project",
    date: "February 2026",
    githubLink: "https://github.com/MMehta45/sprint-ml1",
    color: "bg-rose-50",
    iconSrc: "/projects/remix/LOGO.png",
    media: [
      { type: "image", src: "/projects/remix/remixLogo.png", alt: "Remix — Project Overview", fit: "contain" },
      { type: "image", src: "/projects/remix/Godfrey.JPG", alt: "Remix — Presenting" },
      { type: "image", src: "/projects/remix/remix_stack.png", alt: "Remix — Tech Stack", fit: "contain" },
    ],
  },
  {
    title: "Nudge",
    description:
      "Four broke college students got tired of being broke… so we built an AI budgeting assistant to fix it.",
    shortDesc: "An AI budgeting assistant built by four broke college students.",
    featured: true,
    tags: ["Gemini", "Plaid", "Twilio", "Auth0"],
    status: "hackathon",
    date: "January 2026",
    githubLink: "https://github.com/godfreyponce/tamuhack-26",
    devpostLink: "https://devpost.com/software/tamuhack-pq8rof",
    color: "bg-green-50",
    iconSrc: "/projects/nudge/LOGO.png",
    media: [
      { type: "image", src: "/projects/nudge/nudgelogo.jpeg", alt: "Nudge — Logo" },
      { type: "image", src: "/projects/nudge/nudge.png", alt: "Nudge — Screenshot" },
      { type: "image", src: "/projects/nudge/nudge-stack.png", alt: "Nudge — Tech Stack", fit: "contain" },
    ],
  },
  {
    title: "TechAssist",
    description:
      "A native iOS assistant for data center technicians with 'scan-to-solution' QR navigation.",
    shortDesc: "A native iOS assistant with scan-to-solution QR navigation for data center techs.",
    featured: true,
    tags: ["SwiftUI", "Auth0", "Figma"],
    status: "hackathon",
    date: "October 2025",
    devpostLink: "https://devpost.com/software/techassist",
    githubLink: "https://github.com/godfreyponce/TechAssistCLONE",
    videoUrl: "https://www.youtube.com/watch?v=RTfW7j82g7E",
    color: "bg-orange-50",
    iconSrc: "/tech_assist.png",
  },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "March 2026" -> 202603 for sorting; undated projects sort last. */
function dateKey(date?: string): number {
  if (!date) return 0;
  const [month, year] = date.split(" ");
  return Number(year) * 100 + MONTHS.indexOf(month) + 1;
}

export function projectsNewestFirst(): Project[] {
  return [...projects].sort((a, b) => dateKey(b.date) - dateKey(a.date));
}

/** D1 date treatment (#30): "March 2026" -> "Mar 2026". */
export function shortDate(date: string): string {
  const [month, year] = date.split(" ");
  return `${month.slice(0, 3)} ${year}`;
}
