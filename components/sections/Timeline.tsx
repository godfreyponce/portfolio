"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import TechTag from "@/components/ui/TechTag";

/* tag string -> logo(s); a tag with no entry falls back to the text Badge */
const TAG_LOGOS: Record<string, { label: string; src: string }[]> = {
  WordPress: [{ label: "WordPress", src: "/logos/wordpress.svg" }],
  "HTML/CSS/JS": [
    { label: "HTML", src: "/logos/html5.svg" },
    { label: "CSS", src: "/logos/css.svg" },
    { label: "JavaScript", src: "/logos/javascript.svg" },
  ],
  Jira: [{ label: "Jira", src: "/logos/jira.svg" }],
  DreamWeaver: [{ label: "Dreamweaver", src: "/logos/dreamweaver.svg" }],
  Silktide: [{ label: "Silktide", src: "/logos/silktide.svg" }],
  Python: [{ label: "Python", src: "/logos/python.svg" }],
  "Google Gemini": [{ label: "Google Gemini", src: "/logos/googlegemini.svg" }],
  Tableau: [{ label: "Tableau", src: "/logos/tableau.svg" }],
  n8n: [{ label: "n8n", src: "/logos/n8n.svg" }],
  JavaScript: [{ label: "JavaScript", src: "/logos/javascript.svg" }],
  "iOS/macOS": [{ label: "iOS/macOS", src: "/logos/apple.svg" }],
  Keynote: [{ label: "Keynote", src: "/logos/keynote.svg" }],
};

interface TimelineItemProps {
  date: string;
  title: string;
  subtitle: string;
  logoSrc: string;
  points: string[];
  tags?: string[];
  /* current role: renders the "Present" in the date in accent green */
  present?: boolean;
  isLast?: boolean;
  delay?: number;
}

function TimelineItem({ date, title, subtitle, logoSrc, points, tags, present, isLast, delay = 0 }: TimelineItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <Reveal delay={delay} className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <Avatar src={logoSrc} alt={`${subtitle} logo`} />
        {!isLast && <div className="mb-2 mt-2 w-px grow bg-rule" />}
      </div>

      <div className="pb-12">
        <span className="text-sm font-medium text-ink-faint">
          {present ? (
            <>
              {date.slice(0, date.indexOf("Present"))}
              <span className="font-semibold text-accent-green">Present</span>
            </>
          ) : (
            date
          )}
        </span>
        <h3 className="mt-1 text-xl font-semibold text-ink">{title}</h3>
        <p className="font-medium text-ink-muted">{subtitle}</p>

        {tags && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {tags.flatMap((tag) =>
              TAG_LOGOS[tag] ? (
                TAG_LOGOS[tag].map((icon) => <TechTag key={icon.label} label={icon.label} src={icon.src} />)
              ) : (
                [<Badge key={tag}>{tag}</Badge>]
              )
            )}
          </div>
        )}

        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="group mt-2 inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-ink-faint transition-colors hover:text-accent-green"
        >
          Details
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            className={`transition-transform group-hover:translate-y-1 ${open ? "rotate-180" : ""}`}
          >
            <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className={`grid transition-[grid-template-rows] duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden">
            <ul className="ml-4 mt-3 max-w-lg list-outside list-disc space-y-2 leading-relaxed text-ink-subtle marker:text-ink-faint">
              {points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function Timeline() {
  return (
    <Section className="pb-8 pt-24">
      <Reveal>
        <h2 className="mb-12 font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
          Work Experience
        </h2>
      </Reveal>

      <div className="flex flex-col">
        <TimelineItem
          date="August 2025 - Present"
          present
          title="Web Specialist"
          subtitle="Jonsson School of Engineering & Computer Science (UT Dallas)"
          logoSrc="/utdjonsson_logo.jpeg"
          points={[
            "Managed the technical lifecycle of 20+ departmental and lab websites, implementing high performance responsive frameworks that enhanced the university's digital accessibility.",
            "Coordinated high priority site migrations and asset management using Jira, ensuring seamless delivery of large scale university updates.",
          ]}
          tags={["WordPress", "HTML/CSS/JS", "Jira", "DreamWeaver", "Silktide"]}
        />

        <TimelineItem
          date="November 2025 - January 2026"
          title="AI Data Researcher - Contract"
          subtitle="Handshake AI"
          logoSrc="/team_handshake_logo.jpeg"
          points={[
            "Conducting RLHF to fine-tune multimodal AI models, focusing on alignment, safety, and reasoning logic.",
            "Providing structured feedback on edge cases to engineering teams to support the data centric AI lifecycle.",
          ]}
        />

        <TimelineItem
          date="October 2025 - December 2025"
          title="AI Agent Developer - Externship"
          subtitle="Wayfair"
          logoSrc="/wayfair_logo.jpeg"
          points={[
            "Developing AI agents with Google Gemini 2.5 to automate competitor trend analysis and data scraping.",
            "Building live dashboards to visualize real time market insights extracted from diverse data streams.",
          ]}
          tags={["Python", "Google Gemini", "Tableau", "n8n", "JavaScript"]}
        />

        <TimelineItem
          date="May 2025 - August 2025"
          title="Technical Advisor"
          subtitle="Apple"
          logoSrc="/apple_logo.jpeg"
          points={[
            "Resolved complex iOS/macOS technical issues with a 96% success rate using advanced diagnostics.",
            "Provided user-focused support while relaying critical technical feedback to internal engineering teams.",
          ]}
          tags={["Tableau", "iOS/macOS", "Keynote"]}
        />

        <TimelineItem
          date="Fall 2024 - Present"
          title="Community & Events Officer"
          subtitle="Google Developer Student Club (GDSC)"
          logoSrc="/gdsc_logo.png"
          points={[
            "Spearheaded a social media strategy boosting engagement by 850% and gaining 150k+ video views.",
          ]}
          isLast
        />
      </div>
    </Section>
  );
}
