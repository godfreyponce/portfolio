"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowUpRight,
  Brain,
  ChevronUp,
  Construction,
  DollarSign,
  Eye,
  FlaskConical,
  Github,
  Play,
  Radio,
  Rocket,
  Server,
  Timer,
} from "lucide-react";
import MediaCarousel from "@/components/ui/MediaCarousel";
import Badge from "@/components/ui/Badge";
import { techIcons, type Project } from "@/lib/projects";

const lucideMap = {
  radio: Radio,
  timer: Timer,
  eye: Eye,
  server: Server,
  brain: Brain,
  dollar: DollarSign,
  rocket: Rocket,
} as const;

const statusLabel = {
  live: "Live",
  building: "Building",
  hackathon: "Hackathon",
  project: "Project",
  sprint: "Sprint",
} as const;

export default function ProjectCard({
  project,
  featured = false,
  variant = "grid",
}: {
  project: Project;
  featured?: boolean;
  variant?: "grid" | "stack";
}) {
  const { title, description, tags, status, date, link, githubLink, devpostLink, videoUrl, media, iconSrc, iconLucide } = project;
  const stack = variant === "stack";

  const youtubeId = videoUrl?.includes("youtube.com")
    ? new URL(videoUrl).searchParams.get("v")
    : videoUrl?.includes("youtu.be")
      ? videoUrl.split("/").pop()
      : null;

  const isUnderConstruction = status === "building";
  const [isExpanded, setIsExpanded] = useState(false);

  const LucideIcon = iconLucide ? lucideMap[iconLucide] : null;

  return (
    <div
      className={
        stack
          ? "group relative flex h-full flex-col overflow-hidden rounded-none bg-white/85 backdrop-blur-md md:flex-row"
          : `group relative flex h-full flex-col overflow-hidden rounded-none bg-surface-raised ${featured ? "md:flex-row" : ""}`
      }
    >
      <div
        className={
          stack
            ? "relative flex h-64 w-full items-center justify-center overflow-hidden bg-surface-sunken md:h-full md:w-[55%]"
            : `relative flex aspect-video w-full items-center justify-center overflow-hidden bg-surface-sunken ${featured ? "md:aspect-auto md:w-1/2 md:min-h-96" : ""}`
        }
      >
        {isUnderConstruction && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center">
            <div className="w-full -rotate-2 border-y border-ink/10 bg-amber-400 py-1.5 text-center text-[10px] font-black uppercase tracking-[0.3em] text-ink shadow-sm">
              {"Under construction\u00A0\u00A0\u00A0\u00A0\u00A0Under construction\u00A0\u00A0\u00A0\u00A0\u00A0Under construction"}
            </div>
          </div>
        )}

        {media && media.length > 0 ? (
          <MediaCarousel items={media} title={title} />
        ) : youtubeId ? (
          <iframe
            className="h-full w-full border-0"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&mute=1&controls=1&loop=1&playlist=${youtubeId}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <div className="relative flex flex-col items-center gap-3">
            {isUnderConstruction ? (
              <div className="relative z-10 flex flex-col items-center gap-3 text-ink-faint">
                <Construction size={48} />
                <span className="text-xs font-mono uppercase tracking-widest opacity-60">Drafting system…</span>
              </div>
            ) : LucideIcon ? (
              <div className="scale-150 text-ink-faint opacity-60 transition-transform duration-500 group-hover:scale-[1.65]">
                <LucideIcon size={32} />
              </div>
            ) : (
              <Play className="text-ink-faint opacity-60 transition-transform duration-500 group-hover:scale-110" size={48} />
            )}
          </div>
        )}
      </div>

      <div
        className={
          stack
            ? "relative flex grow flex-col justify-center px-8 py-6 md:w-[45%] md:p-10"
            : `flex grow flex-col justify-between px-8 py-6 ${featured ? "md:w-1/2 md:p-10" : ""}`
        }
      >
        <div className="flex flex-col">
          <div
            className={`mb-4 flex min-w-0 items-center gap-2 sm:justify-between sm:gap-4 ${stack ? "sm:flex-wrap sm:gap-y-3" : ""}`}
          >
            <div className="contents sm:flex sm:items-center sm:gap-4">
              {iconSrc && (
                <Image
                  src={iconSrc}
                  alt={`${title} logo`}
                  width={40}
                  height={40}
                  className="size-10 shrink-0 rounded-sm object-contain"
                />
              )}
              {!iconSrc && LucideIcon && <div className="-my-2 shrink-0 text-ink-muted"><LucideIcon size={20} /></div>}
              <h3 className="min-w-0 flex-1 truncate font-display text-h3 text-ink sm:flex-none sm:overflow-visible sm:text-clip sm:whitespace-normal">
                {title}
              </h3>
            </div>
            <Badge className="shrink-0 max-sm:px-1 max-sm:text-[10px]">
              {statusLabel[status]}
            </Badge>
          </div>

          <p className="mt-2 text-body text-ink-subtle">{description}</p>

          {(link || githubLink || devpostLink) && (
            <div
              className="relative mt-6 w-fit"
              onMouseEnter={() => setIsExpanded(true)}
              onMouseLeave={() => setIsExpanded(false)}
            >
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="group/btn inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-accent"
              >
                View project
                <span className="transition-transform duration-200 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5">
                  {isExpanded ? <ChevronUp size={14} /> : <ArrowUpRight size={14} />}
                </span>
              </button>

              <div className={stack ? "absolute bottom-full left-0 h-3 w-full" : "absolute left-0 top-full z-10 h-4 w-full"} />

              <div
                className={
                  stack
                    ? `absolute bottom-full left-0 z-30 mb-2 w-72 max-w-[80vw] transition-opacity duration-200 ${
                        isExpanded ? "opacity-100" : "pointer-events-none opacity-0"
                      }`
                    : `relative z-20 overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-out ${
                        isExpanded ? "mt-2 max-h-80 opacity-100" : "mt-0 max-h-0 opacity-0"
                      }`
                }
              >
                <div className="flex flex-col gap-4 rounded-none border border-rule bg-surface-sunken p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-2">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} className="gap-1.5">
                          {techIcons[tag] && (
                            <Image src={techIcons[tag]} alt="" width={13} height={13} unoptimized className="opacity-75" />
                          )}
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {date && <span className="ml-auto text-xs font-medium uppercase tracking-wider text-ink-subtle">{date}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    {githubLink && (
                      <a href={githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-sm border border-transparent p-2 text-sm text-ink-muted transition-colors hover:border-rule hover:bg-surface-raised hover:text-ink">
                        <Github size={16} /> GitHub
                      </a>
                    )}
                    {devpostLink && (
                      <a href={devpostLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-sm border border-transparent p-2 text-sm text-ink-muted transition-colors hover:border-rule hover:bg-surface-raised hover:text-ink">
                        <FlaskConical size={16} /> Devpost
                      </a>
                    )}
                    {link && (
                      <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-sm border border-transparent p-2 text-sm text-ink-muted transition-colors hover:border-rule hover:bg-surface-raised hover:text-ink">
                        <ArrowUpRight size={16} /> Live demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
