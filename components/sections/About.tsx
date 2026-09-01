"use client";

import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";

export default function About() {
  return (
    <>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-ink/75 to-transparent" />

      <Section>
        <Reveal>
          <h2 className="text-left text-h2 uppercase text-ink-faint">Bio</h2>
        </Reveal>
        <Reveal delay={0.05} className="mt-6 space-y-6 text-left text-body text-ink-muted">
          <p>
            Hey! I&apos;m a junior Computer Science major with a minor in Cognitive Science at{" "}
            <span className="group relative inline-block cursor-help">
              <span className="hover-bubble font-medium text-ink underline decoration-rule group-hover:text-accent group-hover:decoration-accent">
                UTD
              </span>
              <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max -translate-x-1/2 rounded-sm bg-ink px-3 py-1 text-xs text-white opacity-0 shadow-lift transition-opacity duration-200 group-hover:opacity-100">
                The University of Texas at Dallas
                <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-ink" />
              </span>
            </span>
            , and I like to build things.
          </p>

          <p>
            <button
              onClick={() => {
                document.getElementById("soccer")?.scrollIntoView({ behavior: "smooth" });
                window.dispatchEvent(new CustomEvent("highlight-soccer"));
              }}
              style={{ cursor: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" style=\"font-size: 24px\"><text y=\"20\">⚽</text></svg>'), auto" }}
              className="hover-bubble font-medium text-ink underline decoration-rule hover:text-[#355e3b] hover:decoration-[#355e3b]"
            >
              Soccer
            </button>
            {" "}taught me resilience, discipline, and belief in teamwork. Code gives me a way to use those lessons. Let&apos;s talk about agents, the beautiful game, and everything in between.
          </p>
        </Reveal>
      </Section>
    </>
  );
}
