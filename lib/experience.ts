export interface StackItem {
  label: string;
  src: string;
}

export interface Entry {
  /** DOM id of the entry's <li>, the logo strip's href target */
  id: string;
  org: string;
  orgUrl: string;
  role: string;
  logo: string;
  /** strip alt text; the entry's own 22px logo is decorative */
  logoAlt: string;
  description: string;
  stack?: StackItem[];
  start: string;
  /** "Present" renders bold in accent-green */
  end: string;
}

export const WORK: Entry[] = [
  {
    id: "job-jonsson",
    org: "Jonsson School of Engineering & Computer Science (UT Dallas)",
    orgUrl: "https://engineering.utdallas.edu",
    role: "Web Specialist",
    logo: "/utdjonsson_logo.jpeg",
    logoAlt: "Jonsson School of Engineering and Computer Science",
    description:
      "Managed the technical lifecycle of 20+ departmental and lab websites, implementing high performance responsive frameworks that enhanced the university's digital accessibility.",
    stack: [
      { label: "WordPress", src: "/logos/wordpress.svg" },
      { label: "HTML", src: "/logos/html5.svg" },
      { label: "CSS", src: "/logos/css.svg" },
      { label: "JavaScript", src: "/logos/javascript.svg" },
      { label: "Jira", src: "/logos/jira.svg" },
      { label: "Dreamweaver", src: "/logos/dreamweaver.svg" },
      { label: "Silktide", src: "/logos/silktide.svg" },
    ],
    start: "August 2025",
    end: "Present",
  },
  {
    id: "job-handshake",
    org: "Handshake AI",
    orgUrl: "https://joinhandshake.com",
    role: "AI Data Researcher, Contract",
    logo: "/team_handshake_logo.jpeg",
    logoAlt: "Handshake AI",
    description: "Conducted RLHF to fine-tune multimodal AI models, focusing on alignment, safety, and reasoning logic.",
    start: "November 2025",
    end: "January 2026",
  },
  {
    id: "job-wayfair",
    org: "Wayfair",
    orgUrl: "https://www.wayfair.com",
    role: "AI Agent Developer, Externship",
    logo: "/wayfair_logo.jpeg",
    logoAlt: "Wayfair",
    description: "Developed AI agents with Google Gemini 2.5 to automate competitor trend analysis and data scraping.",
    stack: [
      { label: "Python", src: "/logos/python.svg" },
      { label: "Google Gemini", src: "/logos/googlegemini.svg" },
      { label: "Tableau", src: "/logos/tableau.svg" },
      { label: "n8n", src: "/logos/n8n.svg" },
      { label: "JavaScript", src: "/logos/javascript.svg" },
    ],
    start: "October 2025",
    end: "December 2025",
  },
  {
    id: "job-apple",
    org: "Apple",
    orgUrl: "https://www.apple.com",
    role: "Technical Advisor",
    logo: "/apple_logo.jpeg",
    logoAlt: "Apple",
    description: "Resolved complex iOS/macOS technical issues with a 96% success rate using advanced diagnostics.",
    stack: [
      { label: "Tableau", src: "/logos/tableau.svg" },
      { label: "iOS/macOS", src: "/logos/apple.svg" },
      { label: "Keynote", src: "/logos/keynote.svg" },
    ],
    start: "May 2025",
    end: "August 2025",
  },
  {
    id: "job-gdsc",
    org: "Google Developer Student Club (GDSC)",
    orgUrl: "https://gdg.community.dev",
    role: "Community & Events Officer",
    logo: "/gdsc_logo.png",
    logoAlt: "Google Developer Student Club",
    description: "Spearheaded a social media strategy boosting engagement by 850% and gaining 150k+ video views.",
    start: "Fall 2024",
    end: "Present",
  },
];

export const EDUCATION: Entry[] = [
  {
    id: "edu-utd",
    org: "The University of Texas at Dallas",
    orgUrl: "https://www.utdallas.edu",
    role: "BS in Computer Science",
    logo: "/utd_logo.jpeg",
    logoAlt: "The University of Texas at Dallas",
    description: "Minor in Cognitive Science",
    start: "Fall 2024",
    end: "Spring 2028",
  },
];
