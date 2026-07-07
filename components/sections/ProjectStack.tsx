"use client";

import { useEffect, useRef, useState } from "react";
import { Github } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import ProjectCard from "@/components/sections/ProjectCard";
import Reveal from "@/components/ui/Reveal";
import type { Project } from "@/lib/projects";
import type { Contributions, ContributionDay } from "@/lib/github";

// GitHub's dark-mode contribution scale; level 0 is a faint cell on the dark card
const HEAT_COLORS = ["rgba(255,255,255,0.06)", "#0e4429", "#006d32", "#26a641", "#39d353"];

function Heatmap({ days }: { days: ContributionDay[] }) {
  const firstDow = new Date(days[0].date + "T00:00:00Z").getUTCDay();
  const rows: (ContributionDay | null)[][] = Array.from({ length: 7 }, () => []);
  for (let i = 0; i < firstDow; i++) rows[i].push(null);
  days.forEach((d, i) => rows[(firstDow + i) % 7].push(d));

  return (
    <div className="relative z-10 mt-4 flex flex-col gap-[3px]" aria-hidden>
      {rows.map((row, r) => (
        <div key={r} className="flex gap-[3px]">
          {row.map((d, c) => (
            <div
              key={c}
              className="h-[9px] w-[9px] rounded-[2px]"
              style={{ backgroundColor: d ? HEAT_COLORS[d.level] : "transparent" }}
              title={d ? `${d.date} — ${d.count} contribution${d.count === 1 ? "" : "s"}` : undefined}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function GitHubTile({ stacked = false, contributions }: { stacked?: boolean; contributions?: Contributions | null }) {
  return (
    <a
      href="https://github.com/godfreyponce"
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex h-full flex-col items-center justify-center gap-4 overflow-hidden rounded-xl bg-surface-inverse p-8 text-center text-white transition-colors hover:bg-ink-muted ${
        stacked ? "" : "min-h-60"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] opacity-10 [background-size:16px_16px]" />
      <Github size={48} className="relative z-10 text-ink-faint transition-colors group-hover:text-white" />
      <div className="relative z-10">
        <h3 className="font-display text-xl font-medium">View more on GitHub</h3>
        <p className="mt-2 text-ink-faint">Explore my repositories and contributions</p>
      </div>
      {stacked && contributions && (
        <>
          <Heatmap days={contributions.days} />
          <span className="sr-only">{contributions.total} contributions on GitHub in the last year</span>
        </>
      )}
    </a>
  );
}

function StackedCard({
  index,
  total,
  progress,
  children,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  children: React.ReactNode;
}) {
  const isLast = index === total - 1;
  const targetScale = 1 - (total - 1 - index) * 0.04;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  // Cream veil that settles over a card as the next one covers it.
  const veil = useTransform(progress, [index / total, (index + 1) / total], [0, isLast ? 0 : 0.45]);

  return (
    <motion.div
      className="relative h-[440px] w-full md:sticky"
      style={{ top: `calc(7vh + ${index * 12}px)`, scale, transformOrigin: "top center" }}
    >
      {children}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-xl bg-surface" style={{ opacity: veil }} />
    </motion.div>
  );
}

export default function ProjectStack({
  projects,
  contributions,
}: {
  projects: Project[];
  contributions?: Contributions | null;
}) {
  const reduced = useReducedMotion();
  const [isMd, setIsMd] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsMd(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const stacked = isMd && !reduced;

  if (!stacked) {
    // SSR / mobile / reduced motion: the original grid layout.
    const [featured, ...rest] = projects;
    return (
      <div ref={containerRef} className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
          <GitHubTile />
        </Reveal>
      </div>
    );
  }

  const total = projects.length + 1;

  return (
    <div ref={containerRef} className="relative mx-auto flex w-full max-w-[900px] flex-col gap-[10vh]">
      {projects.map((project, i) => (
        <StackedCard key={project.title} index={i} total={total} progress={scrollYProgress}>
          <ProjectCard project={project} variant="stack" />
        </StackedCard>
      ))}

      <StackedCard index={projects.length} total={total} progress={scrollYProgress}>
        <GitHubTile stacked contributions={contributions} />
      </StackedCard>
    </div>
  );
}
