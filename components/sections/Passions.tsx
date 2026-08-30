"use client";

import { Mountain, Server, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";

export default function Passions() {
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    const handleHighlight = () => {
      setHighlight(true);
      setTimeout(() => setHighlight(false), 2000);
    };
    window.addEventListener("highlight-soccer", handleHighlight);
    return () => window.removeEventListener("highlight-soccer", handleHighlight);
  }, []);

  return (
    <Section className="space-y-12">
      <Reveal className="flex items-center gap-4">
        <div>
          <h2 className="font-display text-3xl font-medium text-ink md:text-4xl">Passions</h2>
          <p className="text-ink-subtle">Beyond my Mac</p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 md:h-[500px] md:grid-cols-3">
        <Reveal
          delay={0.05}
          className={`relative h-[300px] overflow-hidden rounded-none bg-rule-soft transition-shadow duration-500 md:h-auto ${
            highlight ? "ring-2 ring-accent/40" : "ring-0"
          }`}
        >
          <div id="soccer" className="group relative h-full w-full">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
            <div className="absolute bottom-0 left-0 z-20 p-8">
              <div className="mb-2 flex items-center gap-2 text-white/80">
                <Trophy size={18} />
                <span className="text-xs font-semibold uppercase tracking-wider">Soccer</span>
              </div>
              <h3 className="mb-2 font-display text-2xl font-medium text-white md:text-3xl">The Beautiful Game</h3>
              <p className="max-w-md text-sm leading-relaxed text-white/80">
                A lifelong athlete, I believe the best results come from disciplined teamwork, bringing in the same energy and translating it over to professional environments.
              </p>
            </div>
            <Image
              src="/godfrey_soccerShot.jpg"
              alt="Godfrey playing soccer"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="relative h-[300px] overflow-hidden rounded-none bg-surface-sunken md:h-auto">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,var(--color-rule),transparent_60%)]" />
          <svg
            aria-hidden
            viewBox="0 0 400 300"
            preserveAspectRatio="none"
            className="absolute inset-x-0 bottom-0 h-2/3 w-full text-ink/10"
          >
            <path d="M0 220 L80 150 L140 190 L220 110 L300 170 L400 120 L400 300 L0 300 Z" fill="currentColor" />
            <path d="M0 250 L60 200 L130 230 L210 170 L290 210 L400 180 L400 300 L0 300 Z" fill="currentColor" opacity="0.6" />
          </svg>
          <div className="absolute bottom-0 left-0 z-20 p-8">
            <div className="mb-2 flex items-center gap-2 text-ink-subtle">
              <Mountain size={18} />
              <span className="text-xs font-semibold uppercase tracking-wider">Snowboarding</span>
            </div>
            <h3 className="font-display text-2xl font-medium text-ink">Carving Lines</h3>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="relative h-[300px] overflow-hidden rounded-none bg-surface-inverse p-8 md:h-auto">
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="mb-4 flex items-center gap-2 text-white/60">
                <Server size={18} />
                <span className="text-xs font-semibold uppercase tracking-wider">Home Lab</span>
              </div>
              <h3 className="font-display text-2xl font-medium text-white">Self-hosted by default</h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
                I self host my own infrastructure to avoid paying for subscriptions and to keep my data secure/private.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
