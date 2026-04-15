"use client";

import Section from "@/components/ui/Section";

export default function About() {
  return (
    <section className="w-full space-y-8 pb-24">
      <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-ink/75 to-transparent" />

      <Section className="mt-8">
        <h2 className="text-left font-display text-2xl font-medium tracking-tight text-ink md:text-3xl">Bio</h2>
        <div className="mt-6 space-y-6 text-left text-base leading-relaxed text-ink-muted md:text-lg">
          <p>
            Hey! I&apos;m a Sophmore Computer Scientist major at{" "}
            <span className="group relative inline-block cursor-help font-medium text-ink underline decoration-rule transition-colors duration-200 hover:text-accent hover:decoration-accent">
              UTD
              <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max -translate-x-1/2 rounded-sm bg-ink px-3 py-1 text-xs text-white opacity-0 shadow-lift transition-opacity duration-200 group-hover:opacity-100">
                The University of Texas at Dallas
                <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-ink" />
              </span>
            </span>{" "}
            and I am a builder at heart. I thrive in taking concepts for automation in workflows, engineering it into reality, then seeing it solve a real problem.
          </p>
          <p>
            My approach is grounded in Cognitive Science (my minor) where I study how people think so I can build systems that work intuitively for them. Whether it&apos;s architecting autonomous agents or building tools that people actually use, I focus on the human impact of the code I write.
          </p>
          <p>
            This drive comes from the resilience and discipline I&apos;ve built from on the{" "}
            <button
              onClick={() => {
                document.getElementById("soccer")?.scrollIntoView({ behavior: "smooth" });
                window.dispatchEvent(new CustomEvent("highlight-soccer"));
              }}
              style={{ cursor: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" style=\"font-size: 24px\"><text y=\"20\">⚽</text></svg>'), auto" }}
              className="font-medium text-ink underline decoration-rule transition-colors duration-200 hover:text-accent hover:decoration-accent"
            >
              field
            </button>
            , traits that I translate well over to professional environments.
          </p>
        </div>
      </Section>
    </section>
  );
}
