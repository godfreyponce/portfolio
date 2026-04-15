import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";

interface TimelineItemProps {
  date: string;
  title: string;
  subtitle: string;
  logoSrc: string;
  points: string[];
  tags?: string[];
  isLast?: boolean;
  delay?: number;
}

function TimelineItem({ date, title, subtitle, logoSrc, points, tags, isLast, delay = 0 }: TimelineItemProps) {
  return (
    <Reveal delay={delay} className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <Avatar src={logoSrc} alt={`${subtitle} logo`} />
        {!isLast && <div className="mb-2 mt-2 w-px grow bg-rule" />}
      </div>

      <div className="pb-12">
        <span className="text-sm font-medium text-ink-faint">{date}</span>
        <h3 className="mt-1 text-xl font-semibold text-ink">{title}</h3>
        <p className="mb-3 font-medium text-ink-muted">{subtitle}</p>

        <ul className="ml-4 max-w-lg list-outside list-disc space-y-2 leading-relaxed text-ink-subtle marker:text-ink-faint">
          {points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>

        {tags && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
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
          date="August 2025 - Present"
          title="Web Specialist"
          subtitle="Jonsson School of Engineering & Computer Science (UT Dallas)"
          logoSrc="/utdjonsson_logo.jpeg"
          points={[
            "Managed the technical lifecycle of 20+ departmental and lab websites, implementing high performance responsive frameworks that enhanced the university's digital accessibility.",
            "Coordinated high priority site migrations and asset management using Jira, ensuring seamless delivery of large scale university updates.",
          ]}
          tags={["WordPress", "HTML/CSS/JS", "Jira", "DreamWeaver"]}
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
