import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import ProjectStack from "@/components/sections/ProjectStack";
import { projects } from "@/lib/projects";

export default function TheLab() {
  const featured = projects.filter((p) => p.featured);

  return (
    <Section width="wide" className="py-24 space-y-12">
      <Reveal className="flex flex-col items-start gap-2">
        <h2 className="font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">The Lab</h2>
        <p className="text-lg text-ink-subtle">Experiments, agents, and open-source ideas.</p>
      </Reveal>

      <ProjectStack projects={featured} />

      <Reveal className="flex justify-center">
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 rounded-md border border-rule bg-surface-raised px-4 py-3 text-sm font-medium text-ink transition-all hover:border-ink-faint hover:shadow-lift"
        >
          See all projects <span className="font-normal text-ink-faint">({projects.length})</span>
          <ArrowUpRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </Reveal>
    </Section>
  );
}
