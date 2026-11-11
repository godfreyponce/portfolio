"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Image from "next/image";
import { EDUCATION, WORK } from "@/lib/experience";

const ENTRIES = [...WORK, ...EDUCATION];
const STILL_FRAMES = 3;

export default function LogoStrip() {
  const settleRaf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(settleRaf.current), []);

  const setHot = (id: string, on: boolean) => {
    document.getElementById(id)?.toggleAttribute("data-hot", on);
  };

  // Settled = scrollY unchanged for STILL_FRAMES frames in a row (scrollend is missing in older Safari).
  const afterScrollSettles = (fn: () => void) => {
    cancelAnimationFrame(settleRaf.current);
    let lastY = -1;
    let still = 0;
    const tick = () => {
      if (window.scrollY === lastY) {
        if (++still >= STILL_FRAMES) return fn();
      } else {
        still = 0;
        lastY = window.scrollY;
      }
      settleRaf.current = requestAnimationFrame(tick);
    };
    tick();
  };

  const jumpTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.removeAttribute("data-pop");
    target.scrollIntoView({ block: "center" });
    afterScrollSettles(() => {
      void target.offsetWidth; // reflow, so a repeat pop restarts the animation
      target.setAttribute("data-pop", "");
      target.addEventListener("animationend", () => target.removeAttribute("data-pop"), { once: true });
    });
  };

  return (
    <div className="mx-auto max-w-page px-6">
      <section aria-label="Where I've worked and studied" className="border-t border-rule pb-16">
        <p className="mt-10 text-center text-body text-ink-faint">
          Where I&apos;ve worked and studied <span aria-hidden="true">&darr;</span>
        </p>
        <ul className="mt-[30px] grid grid-cols-[repeat(3,56px)] justify-center gap-x-12 gap-y-6 md:flex md:flex-wrap">
          {ENTRIES.map((entry) => (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                className="group block rounded-sm"
                onMouseEnter={() => setHot(entry.id, true)}
                onMouseLeave={() => setHot(entry.id, false)}
                onFocus={() => setHot(entry.id, true)}
                onBlur={() => setHot(entry.id, false)}
                onClick={(event) => jumpTo(event, entry.id)}
              >
                <Image
                  src={entry.logo}
                  alt={entry.logoAlt}
                  width={56}
                  height={56}
                  className="block size-14 object-cover opacity-50 mix-blend-multiply grayscale transition-[filter,opacity] duration-250 group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0 motion-reduce:transition-none"
                />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
