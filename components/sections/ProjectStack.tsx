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
              title={d ? `${d.date}: ${d.count} contribution${d.count === 1 ? "" : "s"}` : undefined}
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
      className={`group relative flex h-full flex-col items-center justify-center gap-4 overflow-hidden rounded-none bg-surface-inverse p-8 text-center text-white transition-colors hover:bg-ink-muted ${
        stacked ? "" : "min-h-60"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] opacity-10 [background-size:16px_16px]" />
      <Github size={48} className="relative z-10 text-ink-faint transition-colors group-hover:text-white" />
      <div className="relative z-10">
        <h3 className="font-display text-h3">View more on GitHub</h3>
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

// #74: the TryHackMe profile at the left end of the streak row. Icon only,
// no number: TryHackMe's bot checkpoint blocks every server-side fetch.
const TRYHACKME_CLASS =
  "flex h-8 w-8 -my-1 items-center justify-center text-ink-faint transition-colors hover:bg-surface-inverse hover:text-white";

function TryHackMeLink() {
  return (
    <a
      href="https://tryhackme.com/p/poncegodfrey"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="TryHackMe profile"
      className={TRYHACKME_CLASS}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true" className="block">
        <path d="M10.705 0C7.54 0 4.902 2.285 4.349 5.291a4.525 4.525 0 0 0-4.107 4.5 4.525 4.525 0 0 0 4.52 4.52h6.761a.625.625 0 1 0 0-1.25H4.761a3.273 3.273 0 0 1-3.27-3.27A3.273 3.273 0 0 1 6.59 7.08a.625.625 0 0 0 .7-1.035 4.488 4.488 0 0 0-1.68-.69 5.223 5.223 0 0 1 5.096-4.104 5.221 5.221 0 0 1 5.174 4.57 4.489 4.489 0 0 0-.488.305.625.625 0 1 0 .731 1.013 3.245 3.245 0 0 1 1.912-.616 3.278 3.278 0 0 1 3.203 2.61.625.625 0 0 0 1.225-.251 4.533 4.533 0 0 0-4.428-3.61 4.54 4.54 0 0 0-.958.105C16.556 2.328 13.9 0 10.705 0zm5.192 10.64a.925.925 0 0 0-.462.108.913.913 0 0 0-.313.29 1.27 1.27 0 0 0-.175.427 2.39 2.39 0 0 0-.054.514c0 .181.018.353.054.517.036.164.095.307.175.43a.899.899 0 0 0 .313.297c.127.073.281.11.462.11.18 0 .334-.037.46-.11a.897.897 0 0 0 .309-.296c.08-.124.137-.267.173-.431.036-.164.054-.336.054-.517 0-.18-.018-.352-.054-.514a1.271 1.271 0 0 0-.173-.426.901.901 0 0 0-.309-.291.917.917 0 0 0-.46-.108zm6.486 0a.925.925 0 0 0-.462.108.913.913 0 0 0-.313.29 1.27 1.27 0 0 0-.175.427 2.39 2.39 0 0 0-.053.514c0 .181.017.353.053.517.036.164.095.307.175.43a.899.899 0 0 0 .313.297c.127.073.281.11.462.11.18 0 .334-.037.46-.11a.897.897 0 0 0 .31-.296c.078-.124.136-.267.172-.431.036-.164.054-.336.054-.517 0-.18-.018-.352-.054-.514a1.271 1.271 0 0 0-.173-.426.901.901 0 0 0-.308-.291.916.916 0 0 0-.461-.108zm-8.537.068l-.84.618.313.43.476-.368v1.877h.603v-2.557zm6.486 0l-.841.618.314.43.477-.368v1.877h.603v-2.557zm-4.435.445c.08 0 .143.028.193.084.05.057.087.127.114.21.026.083.044.173.054.269a2.541 2.541 0 0 1 0 .533c-.01.097-.028.187-.054.27a.584.584 0 0 1-.114.21.243.243 0 0 1-.193.085.248.248 0 0 1-.195-.086.584.584 0 0 1-.118-.209 1.245 1.245 0 0 1-.056-.27 2.645 2.645 0 0 1 0-.533c.01-.096.029-.186.056-.27a.583.583 0 0 1 .118-.209.25.25 0 0 1 .195-.084zm6.486 0c.08 0 .144.028.193.084.05.057.087.127.114.21.027.083.044.173.054.269a2.541 2.541 0 0 1 0 .533c-.01.097-.027.187-.054.27a.584.584 0 0 1-.114.21.243.243 0 0 1-.193.085.249.249 0 0 1-.195-.086.581.581 0 0 1-.117-.209 1.245 1.245 0 0 1-.056-.27 2.642 2.642 0 0 1 0-.533c.01-.096.028-.186.056-.27a.58.58 0 0 1 .117-.209.25.25 0 0 1 .195-.084zm-2.191 3.51a.93.93 0 0 0-.463.109.908.908 0 0 0-.312.291c-.08.122-.139.263-.175.426a2.383 2.383 0 0 0-.054.514c0 .18.018.353.054.516.036.164.094.308.175.432a.91.91 0 0 0 .312.296.92.92 0 0 0 .463.11c.18 0 .333-.037.46-.11a.892.892 0 0 0 .308-.296 1.32 1.32 0 0 0 .174-.432c.036-.163.054-.335.054-.516 0-.18-.018-.352-.054-.514a1.274 1.274 0 0 0-.174-.426.89.89 0 0 0-.309-.291.918.918 0 0 0-.46-.108zm-6.402.07l-.841.617.314.43.476-.369v1.878h.604v-2.557zm2.125 0l-.841.617.314.43.477-.369v1.878h.603v-2.557zm2.116 0l-.84.617.313.43.477-.369v1.878h.603v-2.557zm2.16.443c.08 0 .144.028.194.085a.605.605 0 0 1 .114.21c.026.083.044.172.053.269a2.639 2.639 0 0 1 0 .532 1.28 1.28 0 0 1-.053.27.585.585 0 0 1-.114.21.244.244 0 0 1-.193.085.25.25 0 0 1-.196-.085.589.589 0 0 1-.117-.21 1.245 1.245 0 0 1-.056-.27 2.597 2.597 0 0 1 0-.532c.01-.097.028-.186.056-.27a.589.589 0 0 1 .117-.209.249.249 0 0 1 .196-.085zm-6.729 3.073a.676.676 0 0 0-.335.078.661.661 0 0 0-.227.211.91.91 0 0 0-.127.31c-.027.118-.04.242-.04.373s.013.256.04.375a.93.93 0 0 0 .127.313.65.65 0 0 0 .227.215c.092.053.204.08.335.08a.655.655 0 0 0 .334-.08.65.65 0 0 0 .225-.215c.057-.09.1-.194.125-.313a1.75 1.75 0 0 0 .04-.375c0-.13-.014-.255-.04-.373a.931.931 0 0 0-.125-.31.658.658 0 0 0-.225-.21.667.667 0 0 0-.334-.08zm3.086 0a.675.675 0 0 0-.336.078.661.661 0 0 0-.226.211.907.907 0 0 0-.127.31 1.69 1.69 0 0 0-.04.373c0 .131.013.256.04.375a.928.928 0 0 0 .127.313c.058.09.134.162.226.215.093.053.205.08.336.08a.655.655 0 0 0 .334-.08.65.65 0 0 0 .224-.215c.058-.09.1-.194.126-.313a1.752 1.752 0 0 0 0-.748.94.94 0 0 0-.126-.31.657.657 0 0 0-.224-.21.667.667 0 0 0-.334-.08zm5.108 0a.675.675 0 0 0-.336.078.661.661 0 0 0-.226.211.91.91 0 0 0-.127.31c-.027.118-.04.242-.04.373s.013.256.04.375a.931.931 0 0 0 .127.313c.058.09.134.162.226.215.093.053.205.08.336.08.13 0 .243-.027.334-.08a.65.65 0 0 0 .224-.215c.058-.09.1-.194.126-.313a1.75 1.75 0 0 0 .04-.375c0-.13-.014-.255-.04-.373a.943.943 0 0 0-.126-.31.657.657 0 0 0-.224-.21.668.668 0 0 0-.334-.08zm-6.658.05l-.61.448.227.311.346-.266v1.362h.438v-1.856zm3.068 0l-.61.448.227.311.346-.266v1.362h.438v-1.856zm5.108 0l-.611.448.228.311.346-.266v1.362h.438v-1.856zm-9.712.322c.058 0 .105.02.14.062a.421.421 0 0 1 .083.151.96.96 0 0 1 .04.196 1.932 1.932 0 0 1 0 .386.954.954 0 0 1-.04.197.421.421 0 0 1-.083.152.176.176 0 0 1-.14.061.18.18 0 0 1-.141-.06.427.427 0 0 1-.085-.153.887.887 0 0 1-.041-.197 1.96 1.96 0 0 1 0-.386.893.893 0 0 1 .04-.196.42.42 0 0 1 .086-.151.181.181 0 0 1 .141-.062zm3.086 0c.058 0 .104.02.14.062a.421.421 0 0 1 .082.151.94.94 0 0 1 .04.196 1.906 1.906 0 0 1 0 .386.93.93 0 0 1-.04.197.421.421 0 0 1-.082.152.176.176 0 0 1-.14.061.18.18 0 0 1-.141-.06.42.42 0 0 1-.086-.153.846.846 0 0 1-.04-.197 1.965 1.965 0 0 1-.011-.195c0-.057.004-.121.01-.191a.849.849 0 0 1 .041-.196.42.42 0 0 1 .086-.151.182.182 0 0 1 .141-.062zm5.108 0c.058 0 .104.02.14.062a.421.421 0 0 1 .082.151.92.92 0 0 1 .04.196 1.963 1.963 0 0 1 0 .386.943.943 0 0 1-.04.197.421.421 0 0 1-.082.152.177.177 0 0 1-.14.061.18.18 0 0 1-.142-.06.437.437 0 0 1-.085-.153.95.95 0 0 1-.04-.197 1.965 1.965 0 0 1-.011-.195c0-.057.004-.121.01-.191a.959.959 0 0 1 .04-.196.47.47 0 0 1 .086-.151.181.181 0 0 1 .142-.062zm-1.684 1.814a.675.675 0 0 0-.336.079.66.66 0 0 0-.227.21.91.91 0 0 0-.127.31 1.731 1.731 0 0 0 0 .748.939.939 0 0 0 .127.314c.059.09.134.162.227.215.093.053.205.08.336.08a.66.66 0 0 0 .334-.08.648.648 0 0 0 .224-.215c.058-.09.1-.195.126-.314a1.737 1.737 0 0 0-.001-.747.928.928 0 0 0-.125-.31.65.65 0 0 0-.224-.211.668.668 0 0 0-.334-.079zm3.063 0a.676.676 0 0 0-.336.079.664.664 0 0 0-.227.21.906.906 0 0 0-.127.31 1.74 1.74 0 0 0 0 .748.936.936 0 0 0 .127.314.66.66 0 0 0 .227.215c.092.053.204.08.336.08a.654.654 0 0 0 .334-.08.648.648 0 0 0 .223-.215c.058-.09.1-.195.126-.314a1.74 1.74 0 0 0 0-.747.928.928 0 0 0-.126-.31.65.65 0 0 0-.223-.211.666.666 0 0 0-.334-.079zm-1.545.05l-.611.448.228.312.346-.267v1.363h.438v-1.856zm-1.518.323c.057 0 .104.02.14.061a.42.42 0 0 1 .082.152.91.91 0 0 1 .04.195 1.966 1.966 0 0 1 0 .387.951.951 0 0 1-.04.197.421.421 0 0 1-.082.152.177.177 0 0 1-.14.06.18.18 0 0 1-.142-.06.428.428 0 0 1-.085-.152.914.914 0 0 1-.04-.197 1.96 1.96 0 0 1-.011-.195c0-.058.003-.122.01-.192a.923.923 0 0 1 .041-.195c.02-.06.048-.11.085-.152a.181.181 0 0 1 .142-.061zm3.063 0c.057 0 .104.02.14.061a.42.42 0 0 1 .082.152.94.94 0 0 1 .04.195 1.91 1.91 0 0 1 0 .387.93.93 0 0 1-.04.197.422.422 0 0 1-.083.152.175.175 0 0 1-.14.06.18.18 0 0 1-.141-.06.423.423 0 0 1-.085-.152.907.907 0 0 1-.04-.197 1.95 1.95 0 0 1 0-.387.915.915 0 0 1 .04-.195c.02-.06.048-.11.085-.152a.182.182 0 0 1 .142-.061zm-9.713.185a.465.465 0 0 0-.232.055.456.456 0 0 0-.157.146.627.627 0 0 0-.089.215 1.168 1.168 0 0 0-.027.259c0 .09.009.177.027.26a.648.648 0 0 0 .089.216c.04.063.093.112.157.149a.459.459 0 0 0 .232.056c.09 0 .168-.02.231-.056a.45.45 0 0 0 .156-.149.67.67 0 0 0 .087-.217 1.218 1.218 0 0 0 0-.518.647.647 0 0 0-.087-.215.448.448 0 0 0-.156-.146.458.458 0 0 0-.23-.055zm1.052.035l-.423.31.158.217.24-.185v.944h.303v-1.286zm-1.052.224c.04 0 .073.014.097.042a.284.284 0 0 1 .057.105.69.69 0 0 1 .028.136c.004.049.007.092.007.133 0 .04-.003.086-.007.135a.684.684 0 0 1-.028.136.285.285 0 0 1-.057.105.123.123 0 0 1-.097.043.125.125 0 0 1-.098-.043.298.298 0 0 1-.059-.105.612.612 0 0 1-.028-.136 1.39 1.39 0 0 1 0-.268.62.62 0 0 1 .028-.136.297.297 0 0 1 .06-.105.125.125 0 0 1 .097-.042zm3.775 1.394a.463.463 0 0 0-.232.054.452.452 0 0 0-.157.146.621.621 0 0 0-.088.214 1.19 1.19 0 0 0 0 .519.641.641 0 0 0 .088.217.46.46 0 0 0 .157.15.458.458 0 0 0 .232.054.454.454 0 0 0 .232-.055.45.45 0 0 0 .155-.149.664.664 0 0 0 .087-.217 1.189 1.189 0 0 0 0-.519.642.642 0 0 0-.087-.214.446.446 0 0 0-.155-.146.459.459 0 0 0-.232-.054zm1.052.034l-.423.31.158.216.24-.185v.945h.303V22.68zm-1.052.223c.04 0 .073.014.098.043a.3.3 0 0 1 .057.105.643.643 0 0 1 .027.135 1.31 1.31 0 0 1 0 .268.654.654 0 0 1-.027.137.307.307 0 0 1-.057.105.124.124 0 0 1-.098.042.125.125 0 0 1-.098-.042.293.293 0 0 1-.059-.105.618.618 0 0 1-.028-.137 1.364 1.364 0 0 1 0-.268.612.612 0 0 1 .028-.135.287.287 0 0 1 .06-.105.123.123 0 0 1 .097-.043z" />
      </svg>
    </a>
  );
}

// StreakNumbers is the owner-picked "editorial numerals" treatment (#21):
// current streak with a small flame, longest kept faint beside it.
// #22: on hover the numbers count up from 0 (skipped for reduced motion).
function StreakNumbers({ streaks }: { streaks?: Streaks | null }) {
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
    <span className="flex items-baseline gap-4" onMouseEnter={play}>
      <span className="sr-only">
        {streaks.current} day current streak, {streaks.longest} day longest streak on GitHub
      </span>
      <span aria-hidden className="font-extrabold tracking-[-0.01em] text-[17px] text-ink-muted tabular-nums">
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
  );
}

// #74: the streak row is two-ended. The TryHackMe link sits outside StreakNumbers
// on purpose: StreakNumbers returns null when the GitHub fetch fails, and the
// link must not vanish with it.
function StreakLine({ streaks, className = "" }: { streaks?: Streaks | null; className?: string }) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <TryHackMeLink />
      <StreakNumbers streaks={streaks} />
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
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-none bg-surface" style={{ opacity: veil }} />
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
