import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ProjectStack from "@/components/sections/ProjectStack";
import { projects } from "@/lib/projects";

export default function TheLab() {
  const featured = projects.filter((p) => p.featured);

  return (
    <div className="mx-auto max-w-page px-6">
      <section aria-labelledby="lab" className="border-t border-rule pb-16">
        <h2
          id="lab"
          className="mt-[55px] font-display text-[1.3125rem] font-medium italic leading-[1.3] tracking-[-0.3px] text-ink"
        >
          The Lab&nbsp;&raquo;
        </h2>

        <div className="mt-[51px]">
          <ProjectStack projects={featured} />
        </div>

        <Reveal className="mt-12 flex justify-center">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-md border border-rule bg-surface-raised px-4 py-3 text-sm font-medium text-ink tactile-btn"
          >
            See all projects <span className="font-normal text-ink-faint">({projects.length})</span>
            <ArrowUpRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
