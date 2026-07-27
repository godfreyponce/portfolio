"use client";

import { useEffect, useRef, useState } from "react";
import { Github } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import ProjectCard from "@/components/sections/ProjectCard";
import Reveal from "@/components/ui/Reveal";
import type { Project } from "@/lib/projects";
import { getContributions, getStreaks, type Contributions, type ContributionDay, type Streaks } from "@/lib/github";

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

// Owner-picked "editorial numerals" treatment (#21): current streak in the
// display serif with a small flame, longest kept faint beside it.
// #22: on hover the numbers count up from 0 (skipped for reduced motion).
function StreakLine({ streaks, className = "" }: { streaks?: Streaks | null; className?: string }) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState<{ current: number; longest: number } | null>(null);
  const rafRef = useRef(0);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  if (!streaks) return null;
  const current = shown?.current ?? streaks.current;
  const longest = shown?.longest ?? streaks.longest;

  const play = () => {
    if (reduced) return;
    cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / 600, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown({
        current: Math.round(eased * streaks.current),
        longest: Math.round(eased * streaks.longest),
      });
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const widthCh = (n: number) => `${String(n).length}ch`;

  return (
    <div className={`flex justify-end ${className}`}>
      <span className="flex items-baseline gap-4" onMouseEnter={play}>
        <span className="sr-only">
          {streaks.current} day current streak, {streaks.longest} day longest streak on GitHub
        </span>
        <span aria-hidden className="font-display text-[17px] text-ink-muted tabular-nums">
          <span className="inline-block text-right" style={{ minWidth: widthCh(streaks.current) }}>
            {current}
          </span>{" "}
          <span className="text-[13px]">&#x1F525;</span>
        </span>
        <span aria-hidden className="text-xs text-ink-faint tabular-nums">
          longest{" "}
          <span className="inline-block text-right" style={{ minWidth: widthCh(streaks.longest) }}>
            {longest}
          </span>
        </span>
      </span>
    </div>
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

export default function ProjectStack({ projects }: { projects: Project[] }) {
  // Fetched in the browser so the numbers survive Amplify's frozen ISR cache (#24).
  const [contributions, setContributions] = useState<Contributions | null>(null);
  const [streaks, setStreaks] = useState<Streaks | null>(null);
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

  useEffect(() => {
    getContributions().then(setContributions);
    getStreaks().then(setStreaks);
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
          <div className="flex h-full flex-col gap-3">
            <div className="min-h-0 flex-1">
              <GitHubTile />
            </div>
            <StreakLine streaks={streaks} />
          </div>
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
        <StreakLine streaks={streaks} className="absolute inset-x-0 top-full mt-3" />
      </StackedCard>
    </div>
  );
}
