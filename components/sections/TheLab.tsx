import { Github } from "lucide-react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import ProjectCard from "@/components/sections/ProjectCard";
import { projects } from "@/lib/projects";

export default function TheLab() {
  const [featured, ...rest] = projects;

  return (
    <Section width="wide" className="py-24 space-y-12">
      <Reveal className="flex flex-col items-start gap-2">
        <h2 className="font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">The Lab</h2>
        <p className="text-lg text-ink-subtle">Experiments, agents, and open-source ideas.</p>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {featured && (
          <Reveal delay={0.05} className="md:col-span-2">
            <ProjectCard project={featured} featured />
          </Reveal>
        )}

        {rest.map((project, i) => (
          <Reveal key={project.title} delay={0.1 + i * 0.05}>
            <ProjectCard project={project} />
          </Reveal>
        ))}

        <Reveal delay={0.1 + rest.length * 0.05}>
          <a
            href="https://github.com/godfreyponce"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex h-full min-h-60 flex-col items-center justify-center gap-4 overflow-hidden rounded-xl bg-surface-inverse p-8 text-center text-white transition-colors hover:bg-ink-muted"
          >
            <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] opacity-10 [background-size:16px_16px]" />
            <Github size={48} className="relative z-10 text-ink-faint transition-colors group-hover:text-white" />
            <div className="relative z-10">
              <h3 className="font-display text-xl font-medium">View more on GitHub</h3>
              <p className="mt-2 text-ink-faint">Explore my repositories and contributions</p>
            </div>
          </a>
        </Reveal>
      </div>
    </Section>
  );
}
