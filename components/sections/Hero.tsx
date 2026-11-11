"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import Image from "next/image";
import ScrambleText from "@/components/ui/ScrambleText";
import SocialLink from "@/components/ui/SocialLink";

const EMAIL = "poncegodfrey@gmail.com";
const COPIED_MS = 1600; // decision 20

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copyEmail = () => {
    const done = () => {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), COPIED_MS);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(EMAIL).then(done, done);
    else done();
  };

  const goToSoccer = (e: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById("soccer");
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView();
    window.dispatchEvent(new CustomEvent("highlight-soccer"));
  };

  return (
    <header id="top" className="relative z-20 bg-surface">
      <section className="mx-auto grid max-w-page grid-cols-1 items-start gap-y-8 px-6 pt-12 md:grid-cols-[372px_minmax(0,1fr)] md:gap-x-12 md:pt-32">
        <Image
          src="/godfrey_portrait.jpg"
          alt="Godfrey Ponce"
          width={586}
          height={879}
          sizes="(min-width: 768px) 372px, 100vw"
          priority
          className="block aspect-[2/3] h-auto w-full object-cover object-[50%_30%] md:h-[558px] md:w-[372px]"
        />

        <div>
          <h1 className="-mt-1.5 font-display text-h1 text-ink">Godfrey Ponce</h1>
          <p className="mt-1.5 text-body leading-[1.4] text-ink-faint">
            <ScrambleText text="I like to build agents that think, so we humans can create" />
          </p>

          <div className="mt-7 space-y-6 text-body text-ink-muted">
            <p>
              Hey! I&apos;m a junior Computer Science major with a minor in Cognitive Science at{" "}
              <a
                href="https://www.utdallas.edu"
                title="The University of Texas at Dallas"
                target="_blank"
                rel="noopener noreferrer"
                className="link-dashed"
              >
                UT Dallas
              </a>
              , and I like to build things.
            </p>
            <p>
              <a href="#soccer" className="link-dashed cursor-soccer" onClick={goToSoccer}>
                Soccer
              </a>{" "}
              taught me resilience, discipline, and belief in teamwork. Code gives me a way to use those
              lessons. Let&apos;s talk about agents, the beautiful game, and everything in between.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 md:flex-nowrap">
            <SocialLink
              href="https://linkedin.com/in/godfreyponce"
              ariaLabel="LinkedIn"
              className="inline-flex text-ink-subtle duration-200 hover:!text-brand-linkedin motion-reduce:transition-none"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="block size-5.5">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
              </svg>
            </SocialLink>
            <SocialLink
              href="https://github.com/godfreyponce"
              ariaLabel="GitHub"
              className="inline-flex text-ink-subtle duration-200 motion-reduce:transition-none"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="block size-5.5">
                <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3" />
              </svg>
            </SocialLink>
            <span className="ml-1 inline-flex items-center gap-3 border-l border-rule pl-4 font-mono text-[13px] leading-[1.4] tracking-[0.01em] max-md:ml-0">
              <SocialLink href={"mailto:" + EMAIL} className="link-dashed motion-reduce:transition-none">
                {EMAIL}
              </SocialLink>
              <button
                type="button"
                onClick={copyEmail}
                className={`cursor-pointer transition-colors duration-200 motion-reduce:transition-none ${
                  copied ? "text-accent" : "text-ink-faint hover:text-ink"
                }`}
              >
                {copied ? "copied" : "copy"}
              </button>
              <span role="status" aria-live="polite" className="sr-only">
                {copied ? "copied" : ""}
              </span>
            </span>
          </div>
        </div>
      </section>
    </header>
  );
}
