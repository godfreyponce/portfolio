import type { MediaItem } from "@/components/ui/MediaCarousel";
import type { BadgeTone } from "@/components/ui/Badge";

export interface Project {
  title: string;
  description: string;
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

export const projects: Project[] = [
  {
    title: "CometAdvisor",
    description:
      "Upload your transcript, talk to an AI advisor, and get a personalized semester plan — what to take, who to take it with, and why.",
    tags: ["ElevenLabs", "Nebula API", "Gemini"],
    status: "hackathon",
    date: "March 2026",
    githubLink: "https://github.com/godfreyponce/hackai-26/tree/main",
    devpostLink: "https://devpost.com/software/untitled-project-h2z8qftmvkj9",
    link: "https://www.youtube.com/watch?v=T0LmM8ngKk4",
    color: "bg-violet-50",
    iconSrc: "/projects/cometadvisor/LOGO.png",
    media: [
      { type: "image", src: "/projects/cometadvisor/cometLogo.jpg", alt: "CometAdvisor — Logo" },
      { type: "image", src: "/projects/cometadvisor/comet.jpg", alt: "CometAdvisor — Screenshot" },
      { type: "image", src: "/projects/cometadvisor/comet-stack.png", alt: "CometAdvisor — Tech Stack", fit: "contain" },
    ],
  },
  {
    title: "Remix",
    description:
      "Remix analyzes your resume and job description to surface skill gaps, then builds a personalized interview around them — so you practice what actually matters.",
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
    tags: ["Gemini", "Plaid", "Twilio", "Auth0"],
    status: "hackathon",
    date: "January 2026",
    githubLink: "https://github.com/godfreyponce/tamuhack-26",
    devpostLink: "https://devpost.com/software/tamuhack-pq8rof",
    color: "bg-green-50",
    iconSrc: "/projects/nudge/LOGO.png",
    media: [
      { type: "image", src: "/projects/nudge/nudgelogo.jpg", alt: "Nudge — Logo" },
      { type: "image", src: "/projects/nudge/nudge.jpg", alt: "Nudge — Screenshot" },
      { type: "image", src: "/projects/nudge/nudge-stack.png", alt: "Nudge — Tech Stack", fit: "contain" },
    ],
  },
  {
    title: "TechAssist",
    description:
      "A native iOS assistant for data center technicians with 'scan-to-solution' QR navigation.",
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
