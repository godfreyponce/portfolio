import { Github } from "lucide-react";
import Section from "@/components/ui/Section";
import ProjectCard from "@/components/sections/ProjectCard";
import { projects } from "@/lib/projects";

export default function TheLab() {
  return (
    <Section className="py-24 space-y-12">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="font-display text-3xl font-medium text-ink">The Lab</h2>
        <p className="text-lg text-ink-subtle">Experiments, agents, and open-source ideas.</p>
      </div>

      <div className="flex flex-col gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}

        <a
          href="https://github.com/godfreyponce"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex min-h-[200px] flex-col items-center justify-center gap-4 overflow-hidden rounded-xl bg-surface-inverse p-8 text-center text-white transition-colors hover:bg-ink-muted"
        >
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] opacity-10 [background-size:16px_16px]" />
          <Github size={48} className="relative z-10 text-ink-faint transition-colors group-hover:text-white" />
          <div className="relative z-10">
            <h3 className="font-display text-xl font-medium">View more on GitHub</h3>
            <p className="mt-2 text-ink-faint">Explore my repositories and contributions</p>
          </div>
        </a>
      </div>
    </Section>
  );
}
