import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import ProjectStack from "@/components/sections/ProjectStack";
import { projects } from "@/lib/projects";
import { getContributions } from "@/lib/github";

export default async function TheLab() {
  const contributions = await getContributions();
  return (
    <Section width="wide" className="py-24 space-y-12">
      <Reveal className="flex flex-col items-start gap-2">
        <h2 className="font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">The Lab</h2>
        <p className="text-lg text-ink-subtle">Experiments, agents, and open-source ideas.</p>
      </Reveal>

      <ProjectStack projects={projects} contributions={contributions} />
    </Section>
  );
}
