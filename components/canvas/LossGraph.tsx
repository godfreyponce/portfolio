"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const N = 360; // points along the curve
const TOTAL_STEPS = 50000;
const DRAW_FRAMES = 7 * 60; // ~7s per run at 60fps
const HOLD_FRAMES = 70; // pause on the converged curve before the next run
const MAX_GHOSTS = 4;

const INK = "rgba(28, 25, 23, 0.6)";
const GHOST = "rgba(28, 25, 23, 0.12)";
const ACCENT = "#c2410c";

function noise(t: number) {
  return Math.sin(t) * Math.sin(t * 2.5) * Math.sin(t * 0.5);
}

function curveTarget(p: number, w: number, h: number, seed: number) {
  const baseline = h * 0.7;
  const amp = h * 0.4;
  const decay = Math.exp(-4 * p);
  const t = (p * w + seed) * 0.01;
  return baseline - amp * decay - noise(t * 10) * (decay * 40);
}

// 2.303 = ln(10): where cross-entropy starts on a 10-class problem
function yToLoss(y: number, h: number) {
  return Math.max(0.015, ((h * 0.7 - y) / (h * 0.4)) * 2.303);
}

export default function LossGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readoutRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const readout = readoutRef.current;
    if (!canvas || !readout) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let ys: number[] = [];
    const ghosts: number[][] = [];
    let runIdx = 0;
    let frame = 0;
    let holding = 0;
    let best = Infinity;
    let animationFrameId = 0;
    let running = false;

    // "pluck the string" spring physics, one offset per curve point
    const points = Array.from({ length: N + 1 }, () => ({ y: 0, vy: 0 }));
    let prevMouseY = 0;

    const genRun = () => {
      const seed = 559 + runIdx * 977;
      ys = [];
      for (let i = 0; i <= N; i++) ys.push(curveTarget(i / N, w, h, seed));
    };

    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.parentElement?.clientWidth || window.innerWidth;
      h = canvas.parentElement?.clientHeight || 192;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const strokeCurve = (
      trace: number[],
      upTo: number,
      style: string,
      width: number,
      springs: boolean
    ) => {
      ctx.beginPath();
      ctx.strokeStyle = style;
      ctx.lineWidth = width;
      for (let i = 0; i <= upTo; i++) {
        const x = (i / N) * w;
        const y = trace[i] + (springs ? points[i].y : 0);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    // reduced motion: a static composition of ghosts + converged run, no loop
    if (reducedMotion) {
      const renderStatic = () => {
        fit();
        ctx.clearRect(0, 0, w, h);
        for (let r = 0; r < 3; r++) {
          runIdx = r;
          genRun();
          strokeCurve(ys, N, GHOST, 1.5, false);
        }
        runIdx = 3;
        genRun();
        strokeCurve(ys, N, INK, 2, false);
        readout.textContent = `run 4 · loss ${yToLoss(ys[N], h).toFixed(3)}`;
      };
      renderStatic();
      window.addEventListener("resize", renderStatic);
      return () => window.removeEventListener("resize", renderStatic);
    }

    const resize = () => {
      fit();
      // curve x-positions changed; past runs no longer line up
      ghosts.length = 0;
      best = Infinity;
      genRun();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const dy = my - prevMouseY;
      for (let i = 0; i <= N; i++) {
        const px = (i / N) * w;
        const dx = Math.abs(mx - px);
        if (dx < 20) {
          points[i].vy += dy * 0.1 * Math.pow(1 - dx / 20, 2);
        }
      }
      prevMouseY = my;
    };

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      for (const p of points) {
        p.vy += (0 - p.y) * 0.05;
        p.vy *= 0.95;
        p.y += p.vy;
      }

      for (const g of ghosts) strokeCurve(g, N, GHOST, 1.5, false);

      const p = Math.min(1, frame / DRAW_FRAMES);
      const headIdx = Math.floor(p * N);
      strokeCurve(ys, headIdx, INK, 2, true);

      const hx = (headIdx / N) * w;
      const hy = ys[headIdx] + points[headIdx].y;
      ctx.save();
      ctx.shadowColor = ACCENT;
      ctx.shadowBlur = 10;
      ctx.fillStyle = ACCENT;
      ctx.beginPath();
      ctx.arc(hx, hy, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const loss = yToLoss(ys[headIdx], h);
      if (p < 1) {
        const bestStr = best < Infinity ? ` · best ${best.toFixed(3)}` : "";
        readout.textContent = `run ${runIdx + 1} · step ${Math.floor(p * TOTAL_STEPS).toLocaleString()} · loss ${loss.toFixed(3)}${bestStr}`;
        frame++;
      } else {
        if (holding === 0) {
          readout.innerHTML =
            loss < best
              ? `run ${runIdx + 1} · loss ${loss.toFixed(3)} <span class="text-accent">★ new best</span>`
              : `run ${runIdx + 1} · loss ${loss.toFixed(3)} · best ${best.toFixed(3)} <span class="text-accent">✓</span>`;
        }
        holding++;
        if (holding > HOLD_FRAMES) {
          best = Math.min(best, loss);
          ghosts.push(ys);
          if (ghosts.length > MAX_GHOSTS) ghosts.shift();
          runIdx++;
          frame = 0;
          holding = 0;
          genRun();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) return;
      running = true;
      draw();
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(animationFrameId);
    };

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: "100px" }
    );

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouseMove);
    observer.observe(canvas);

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [reducedMotion]);

  return (
    <div className="w-full py-12">
      <div className="relative h-48 w-full cursor-crosshair overflow-hidden">
        <canvas ref={canvasRef} className="h-full w-full" />
        <div
          ref={readoutRef}
          className="pointer-events-none absolute right-6 top-0 select-none font-mono text-xs tracking-wide text-ink-subtle tabular-nums"
        />
      </div>
    </div>
  );
}
