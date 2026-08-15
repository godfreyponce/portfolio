"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

// 404 count-up for the not-found page (#31). Ease-out cubic, same curve as the
// streak counter (#26).
export default function NotFoundCounter() {
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduced) {
      setN(404);
      return;
    }
    const t0 = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * 404));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <h1 className="font-display text-[clamp(96px,20vw,160px)] font-semibold leading-none tracking-[-0.02em] tabular-nums">
      {n}
    </h1>
  );
}
