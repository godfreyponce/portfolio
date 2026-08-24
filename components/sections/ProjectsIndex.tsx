"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, ChevronRight, FlaskConical, Github } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Badge from "@/components/ui/Badge";
import MediaCarousel, { type MediaItem } from "@/components/ui/MediaCarousel";
import { GROUPS, projectsNewestFirst, shortDate, techIcons, type Project, type ProjectGroup } from "@/lib/projects";

// Row pill copy (#30 owner pick): "Personal", not the homepage's "Project".
const rowLabel = { live: "Live", building: "Building", hackathon: "Hackathon", project: "Personal" } as const;

function youtubeId(url?: string): string | null {
  if (!url) return null;
  if (url.includes("youtube.com")) return new URL(url).searchParams.get("v");
  if (url.includes("youtu.be")) return url.split("/").pop() ?? null;
  return null;
}

function rowMedia(project: Project): MediaItem[] {
  if (project.media && project.media.length > 0) return project.media;
  const id = youtubeId(project.videoUrl);
  if (id) return [{ type: "youtube", src: "", videoId: id }];
  return [];
}

function ProjectRow({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const media = rowMedia(project);
  const { title, shortDesc, description, tags, status, date, link, githubLink, devpostLink, iconSrc, color = "bg-rule-soft" } = project;

  return (
    <div className="border-b border-rule">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-2 py-4 text-left transition-colors hover:bg-accent-soft"
      >
        <ChevronRight
          size={16}
          className={`shrink-0 text-ink-faint transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        />
        {iconSrc ? (
          <Image
            src={iconSrc}
            alt=""
            width={40}
            height={40}
            className={`size-10 shrink-0 rounded-sm object-contain ${color}`}
          />
        ) : (
          <div className={`size-10 shrink-0 rounded-sm ${color}`} />
        )}
        <div className="min-w-0 flex-1">
          <div className="font-display text-xl font-medium text-ink">{title}</div>
          <div className="hidden truncate text-sm text-ink-subtle sm:block">{shortDesc}</div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Badge tone={status}>{rowLabel[status]}</Badge>
          {date && (
            <span className="hidden w-16 text-right text-xs tabular-nums text-ink-faint sm:block">
              {shortDate(date)}
            </span>
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-8 pt-2 sm:pl-16">
              <div className="flex flex-col gap-6 sm:flex-row">
                {media.length > 0 && (
                  <div className="relative aspect-[3/2] w-full shrink-0 overflow-hidden rounded-md border border-rule bg-surface-sunken sm:w-[55%]">
                    <MediaCarousel items={media} title={title} />
                  </div>
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-5">
                  <p className="max-w-prose text-base leading-relaxed text-ink-muted">{description}</p>
                  {tags.length > 0 && (
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-ink-faint">Built with</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            tabIndex={0}
                            className="group gap-1.5 outline-offset-2 hover:border-accent hover:text-ink focus-visible:border-accent focus-visible:text-ink motion-safe:transition motion-safe:hover:-translate-y-0.5 motion-safe:focus-visible:-translate-y-0.5"
                          >
                            {techIcons[tag] && (
                              <Image
                                src={techIcons[tag]}
                                alt=""
                                width={13}
                                height={13}
                                unoptimized
                                className="opacity-75 group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:transition-opacity"
                              />
                            )}
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-auto flex flex-wrap gap-4">
                    {githubLink && (
                      <a href={githubLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-accent">
                        <Github size={14} /> GitHub
                      </a>
                    )}
                    {devpostLink && (
                      <a href={devpostLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-accent">
                        <FlaskConical size={14} /> Devpost
                      </a>
                    )}
                    {link && (
                      <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-accent">
                        <ArrowUpRight size={14} /> Live demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProjectsIndex() {
  const [group, setGroup] = useState<ProjectGroup | "all">("all");
  const all = projectsNewestFirst();

  return (
    <div className="mx-auto w-full max-w-[960px] px-6 pb-24 pt-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-subtle transition-colors hover:text-ink"
      >
        <ArrowLeft size={14} /> Home
      </Link>
      <h1 className="mt-6 font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">Projects</h1>
      <p className="mt-2 text-lg text-ink-subtle">
        Everything I have built, from hackathon weekends to long-running personal projects.
      </p>

      <nav className="mt-6 flex flex-wrap gap-6">
        {[{ key: "all" as const, tab: "All" }, ...GROUPS].map(({ key, tab }) => (
          <button
            key={key}
            onClick={() => setGroup(key)}
            aria-pressed={group === key}
            className={`border-b py-1 text-sm font-medium transition-colors ${
              group === key ? "border-ink text-ink" : "border-transparent text-ink-subtle hover:text-ink"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {GROUPS.filter(({ key }) => group === "all" || group === key).map(({ key, label }) => {
        const rows = all.filter((p) => p.group === key);
        if (rows.length === 0) return null;
        return (
          <section key={key} className="mt-12">
            <h2 className="font-display text-2xl font-medium text-ink">{label}</h2>
            <div className="mt-4 border-t border-rule">
              {rows.map((p) => (
                <ProjectRow key={p.title} project={p} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
