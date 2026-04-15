"use client";

import { Heart, Mountain, Server, Terminal, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

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
    <section className="mx-auto w-full max-w-6xl space-y-12 px-6 py-24">
      <div className="flex items-center gap-4">
        <div className="rounded-md bg-accent-soft p-3 text-accent">
          <Heart size={24} />
        </div>
        <div>
          <h2 className="font-display text-3xl font-medium text-ink">Passions</h2>
          <p className="text-ink-subtle">Beyond my Mac</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:h-[500px] md:grid-cols-2">
        <div
          id="soccer"
          className={`group relative h-[300px] overflow-hidden rounded-xl bg-rule-soft transition-shadow duration-500 md:row-span-2 md:h-auto ${
            highlight ? "ring-2 ring-accent/40" : "ring-0"
          }`}
        >
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
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

        <div className="group relative h-[300px] overflow-hidden rounded-xl bg-rule-soft md:h-auto">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 z-20 p-8">
            <div className="mb-2 flex items-center gap-2 text-white/80">
              <Mountain size={18} />
              <span className="text-xs font-semibold uppercase tracking-wider">Snowboarding</span>
            </div>
            <h3 className="font-display text-2xl font-medium text-white md:text-xl">Carving Lines</h3>
          </div>
          <div className="h-full w-full bg-ink-muted transition-transform duration-700 group-hover:scale-105" />
        </div>

        <div className="group relative flex h-[300px] flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-surface-inverse p-8 md:h-auto">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] opacity-20 [background-size:24px_24px]" />

          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-3 text-emerald-400">
              <Server size={24} />
              <span className="rounded-sm bg-emerald-400/10 px-2 py-1 font-mono text-xs">SYSTEM_ONLINE</span>
            </div>
            <h3 className="font-display text-2xl font-medium text-white">Home Lab</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              I self host my own infrastructure to avoid paying for subscriptions and to keep my data secure/private.
            </p>
          </div>

          <div className="relative z-10 mt-4 flex gap-3">
            <div className="flex items-center gap-2 rounded-sm border border-white/10 bg-ink px-3 py-1.5 font-mono text-xs text-white/60">
              <Terminal size={12} />
              <span>~/docker</span>
            </div>
            <div className="flex items-center gap-2 rounded-sm border border-white/10 bg-ink px-3 py-1.5 font-mono text-xs text-white/60">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span>n8n active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
