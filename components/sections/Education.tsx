import { ArrowUpRight } from "lucide-react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import Avatar from "@/components/ui/Avatar";

interface EducationItemProps {
  title: string;
  subtitle: string;
  date: string;
  description?: string;
  points?: string[];
  logoSrc: string;
  link?: string;
}

function EducationItem({ title, subtitle, date, description, points, logoSrc, link }: EducationItemProps) {
  return (
    <div className="group relative flex items-start gap-4 rounded-md p-4 transition-colors hover:bg-rule-soft">
      <Avatar src={logoSrc} alt={`${subtitle} logo`} variant={subtitle.includes("GDSC") ? "contain" : "cover"} />
      <div className="flex-1">
        <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-ink">{title}</h3>
            {link && (
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-ink-faint transition-colors hover:text-ink">
                <ArrowUpRight size={16} />
              </a>
            )}
          </div>
          <span className="whitespace-nowrap text-xs font-medium uppercase tracking-wider text-ink-faint">{date}</span>
        </div>
        <p className="text-sm font-medium text-ink-muted">{subtitle}</p>
        {description && <p className="mt-2 text-sm leading-relaxed text-ink-subtle">{description}</p>}
        {points && (
          <ul className="mt-3 space-y-2">
            {points.map((point, index) => (
              <li key={index} className="flex gap-2 text-sm leading-relaxed text-ink-subtle">
                <span className="text-ink-faint">•</span>
                {point}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function Education() {
  return (
    <Section>
      <Reveal>
        <h2 className="mb-8 font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
          Education
        </h2>
      </Reveal>
      <Reveal delay={0.05} className="space-y-4">
        <EducationItem
          title="BS in Computer Science"
          subtitle="The University of Texas at Dallas"
          date="Fall 2024 - Winter 2027"
          description="Minor in Cognitive Science"
          logoSrc="/utd_logo.jpeg"
        />
      </Reveal>
    </Section>
  );
}
