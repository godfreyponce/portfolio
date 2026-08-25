import type { MediaItem } from "@/components/ui/MediaCarousel";
import type { BadgeTone } from "@/components/ui/Badge";

export type ProjectGroup = "daily" | "work" | "hackathons" | "misc";

export interface Project {
  title: string;
  description: string;
  /** Hand-written one-liner for /projects index rows; full description shows expanded (#30). */
  shortDesc: string;
  /** README-mirroring section on /projects (#36). */
  group: ProjectGroup;
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

// Section order and visitor-facing labels for /projects (#36). Copy mirrors the profile README;
// `tab` is the shorter label the group toggle above the list uses.
export const GROUPS: { key: ProjectGroup; label: string; tab: string }[] = [
  { key: "daily", label: "Things I actually use every day", tab: "Every day" },
  { key: "work", label: "Work stuff", tab: "Work" },
  { key: "hackathons", label: "Hackathons and sprints", tab: "Hackathons and sprints" },
  { key: "misc", label: "Everything else", tab: "Everything else" },
];

export const projects: Project[] = [
  {
    title: "CometAdvisor",
    description:
      "Upload your transcript, talk to an AI advisor, and get a personalized semester plan — what to take, who to take it with, and why.",
    shortDesc: "An AI advisor that turns your transcript into a semester plan.",
    group: "hackathons",
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
    group: "hackathons",
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
    group: "hackathons",
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
    group: "hackathons",
    featured: true,
    tags: ["SwiftUI", "Auth0", "Figma"],
    status: "hackathon",
    date: "October 2025",
    devpostLink: "https://devpost.com/software/techassist",
    githubLink: "https://github.com/godfreyponce/TechAssistCLONE",
    videoUrl: "https://www.youtube.com/watch?v=RTfW7j82g7E",
    color: "bg-orange-50",
    iconSrc: "/tech_assist.png",
    media: [
      { type: "image", src: "/projects/techassist/techassist-scan.jpeg", alt: "TechAssist QR scanner screen", fit: "contain" },
      { type: "image", src: "/projects/techassist/techassist-home.jpg", alt: "TechAssist home screen with the work order list", fit: "contain" },
      { type: "image", src: "/projects/techassist/techassist-search.jpg", alt: "TechAssist troubleshooting article search", fit: "contain" },
      { type: "youtube", src: "", videoId: "RTfW7j82g7E" },
    ],
  },
  {
    title: "kal",
    description: "My personal fitness chat app. A Claude assistant that knows my meal plan and writes my daily log.",
    shortDesc: "Started tracking my calories, so I built a tracker.",
    group: "daily",
    tags: ["Next.js", "Claude", "Neon", "iron-session"],
    status: "project",
    date: "June 2026",
    githubLink: "https://github.com/godfreyponce/kal",
    color: "bg-sky-50",
    media: [
      { type: "image", src: "/projects/kal/kalLogo.png", alt: "kal wordmark", fit: "contain" },
      { type: "image", src: "/projects/kal/kal.png", alt: "kal chat logging an off-plan meal", fit: "contain" },
      { type: "image", src: "/projects/kal/kal-today.png", alt: "kal Today dashboard", fit: "contain" },
    ],
  },
  {
    title: "Debrief",
    description: "My morning paper. One page of what the people I track posted in the last 24 hours.",
    shortDesc: "My morning paper. Makes it easier for me to keep up with AI and tech.",
    group: "daily",
    tags: ["Python", "Vercel Functions", "Nitter", "YouTube RSS", "Substack"],
    status: "project",
    date: "May 2026",
    githubLink: "https://github.com/godfreyponce/Debrief",
    color: "bg-amber-50",
  },
  {
    title: "glass",
    description: "Dashboard for my projects. Renders from markdown and edits in place through the GitHub API.",
    shortDesc: "A simplified way to check on everything I'm building.",
    group: "daily",
    tags: ["Next.js", "GitHub API", "Claude Code CLI", "iron-session", "Zod"],
    status: "project",
    date: "May 2026",
    githubLink: "https://github.com/godfreyponce/glass",
    color: "bg-cyan-50",
  },
  {
    title: "Jira-Alerts",
    description: "DMs me on Teams when a Jira ticket gets a new comment or @mention.",
    shortDesc: "Jira emails are horrible, so my tickets DM me on Teams instead.",
    group: "work",
    tags: ["Python", "Jira Data Center API", "Microsoft Teams", "Power Automate", "launchd"],
    status: "project",
    date: "June 2026",
    githubLink: "https://github.com/godfreyponce/Jira-Alerts",
    color: "bg-blue-50",
    media: [
      { type: "image", src: "/projects/jira-alerts/jira-alertsLogo.png", alt: "Jira-Alerts banner", fit: "contain" },
      { type: "image", src: "/projects/jira-alerts/jira-alerts.png", alt: "Jira-Alerts Teams notification for a new comment", fit: "contain" },
      { type: "image", src: "/projects/jira-alerts/jira-alerts-flow.png", alt: "Jira-Alerts Power Automate flow" },
    ],
  },
  {
    title: "jiraPlane",
    description: "A paper airplane that flies across my screen when Jira needs me.",
    shortDesc: "Basically Jira-Alerts with an upgraded visual. A paper airplane flies across my screen when Jira needs me.",
    group: "work",
    tags: ["Electron", "Node.js", "Jira REST API", "Power Automate", "CSS Animation"],
    status: "project",
    date: "July 2026",
    githubLink: "https://github.com/godfreyponce/jiraPlane",
    color: "bg-indigo-50",
    media: [
      { type: "image", src: "/projects/jiraplane/jiraplaneLogo.png", alt: "jiraPlane paper plane towing a Jira tag", fit: "contain" },
      { type: "image", src: "/projects/jiraplane/jiraplane.png", alt: "jiraPlane flying across a laptop screen" },
    ],
  },
  {
    title: "clawd",
    description: "Clyde the crab on an ESP32 desk screen, reacting to my Claude Code session.",
    shortDesc: "I 3D printed a crab on my desk so I know how my agents are doing.",
    group: "misc",
    tags: ["ESP32-C3", "Arduino", "Adafruit ST7789", "Claude Code Hooks", "Next.js"],
    status: "project",
    date: "June 2026",
    githubLink: "https://github.com/godfreyponce/clawd",
    color: "bg-red-50",
  },
  {
    title: "terrariaCompanion",
    description: "Terraria companion for my mage run. Answers from a wiki scrape with an image and 3 bullets.",
    shortDesc: "Played Terraria for the first time this year, idk where to start, so I built this.",
    group: "misc",
    tags: ["Next.js", "React", "OpenAI", "terraria.wiki.gg"],
    status: "project",
    date: "May 2026",
    githubLink: "https://github.com/godfreyponce/terrariaCompanion",
    color: "bg-emerald-50",
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
