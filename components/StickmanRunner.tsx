"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Scroll buddy: his position mirrors your scroll. Scroll down and he runs right,
// scroll up and he moonwalks back. Stop and he stands there breathing, blinking.
const BASE_Y = 74;
const ARM_LEN = 18;
const LEG_LEN = 22;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

interface Pose {
  x: number;
  y: number;
  lean: number; // degrees
  armL: number; // radians from straight-down, +x is forward
  armR: number;
  legL: number;
  legR: number;
  mouth: number;
  eyeR: number;
  eyeDx: number;
}

export default function StickmanRunner() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const armLRef = useRef<SVGLineElement>(null);
  const armRRef = useRef<SVGLineElement>(null);
  const legLRef = useRef<SVGLineElement>(null);
  const legRRef = useRef<SVGLineElement>(null);
  const eyeLRef = useRef<SVGCircleElement>(null);
  const eyeRRef = useRef<SVGCircleElement>(null);
  const mouthRef = useRef<SVGPathElement>(null);

  const rafRef = useRef(0);
  const runningRef = useRef(false);
  const widthRef = useRef(600);
  const motionRef = useRef({ phase: 0, lastX: null as number | null, vel: 0, lastMove: 0, blinkAt: -1, blinkStart: -1 });

  const [width, setWidth] = useState(600);

  useEffect(() => {
    if (reduced) return;
    const el = containerRef.current;
    if (!el) return;

    const applyPose = (pose: Pose) => {
      const setLimb = (line: SVGLineElement | null, angle: number, len: number, originY: number) => {
        if (!line) return;
        line.setAttribute("x2", String(Math.sin(angle) * len));
        line.setAttribute("y2", String(originY + Math.cos(angle) * len));
      };
      gRef.current?.setAttribute("transform", `translate(${pose.x} ${pose.y}) rotate(${pose.lean} 0 -8)`);
      gRef.current?.setAttribute("opacity", "1");
      setLimb(armLRef.current, pose.armL, ARM_LEN, -16);
      setLimb(armRRef.current, pose.armR, ARM_LEN, -16);
      setLimb(legLRef.current, pose.legL, LEG_LEN, 8);
      setLimb(legRRef.current, pose.legR, LEG_LEN, 8);
      mouthRef.current?.setAttribute("d", `M -4 -29 Q 0 ${-29 + pose.mouth * 4.5} 4 -29`);
      if (eyeLRef.current) {
        eyeLRef.current.setAttribute("cx", String(-3.5 + pose.eyeDx));
        eyeLRef.current.setAttribute("r", String(pose.eyeR));
      }
      if (eyeRRef.current) {
        eyeRRef.current.setAttribute("cx", String(3.5 + pose.eyeDx));
        eyeRRef.current.setAttribute("r", String(pose.eyeR));
      }
    };

    const tick = (ts: number) => {
      if (!runningRef.current) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const m = motionRef.current;

      // Traverse the band as it moves through the viewport
      const pr = clamp(1 - (rect.top + 70) / (vh * 1.7), 0, 1);
      const x = lerp(-30, widthRef.current + 30, pr);
      const dx = m.lastX === null ? 0 : x - m.lastX;
      m.lastX = x;
      m.vel = m.vel * 0.85 + dx * 0.15;
      if (Math.abs(dx) > 0.3) m.lastMove = ts;
      m.phase += Math.abs(dx) * 0.085; // legs move with distance covered

      const moving = ts - m.lastMove < 350;
      const s = Math.sin(m.phase) * 0.85;
      const pose: Pose = { x, y: BASE_Y, lean: 0, armL: 0.18, armR: -0.18, legL: 0.14, legR: -0.14, mouth: 0.6, eyeR: 1.3, eyeDx: 0 };

      if (moving) {
        pose.y = BASE_Y - Math.abs(Math.sin(m.phase)) * 5;
        pose.lean = clamp(m.vel * 2.2, -16, 16); // leans into the direction of travel
        pose.legL = s;
        pose.legR = -s;
        pose.armL = -s * 0.8;
        pose.armR = s * 0.8;
        pose.eyeDx = clamp(m.vel, -2, 2);
      } else {
        // Standing: breathing bob + occasional blink
        const bt = ts * 0.004;
        pose.y = BASE_Y - 1.5 + Math.sin(bt) * 1.5;
        pose.armL = 0.18 + Math.sin(bt) * 0.04;
        pose.armR = -0.18 - Math.sin(bt) * 0.04;
        pose.mouth = 0.55;
        if (m.blinkAt < 0) m.blinkAt = ts + 1500 + Math.random() * 1500;
        if (ts >= m.blinkAt && m.blinkStart < 0) {
          m.blinkStart = ts;
          m.blinkAt = ts + 2800 + Math.random() * 1600;
        }
        if (m.blinkStart >= 0) {
          const bp = (ts - m.blinkStart) / 140;
          if (bp >= 1) m.blinkStart = -1;
          else pose.eyeR *= Math.max(0.15, bp < 0.5 ? 1 - bp * 2 : (bp - 0.5) * 2);
        }
      }

      applyPose(pose);
      rafRef.current = requestAnimationFrame(tick);
    };

    const start = () => {
      if (runningRef.current) return;
      motionRef.current.lastX = null; // no velocity spike from the jump back into view
      runningRef.current = true;
      rafRef.current = requestAnimationFrame(tick);
    };

    const stop = () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
    };

    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width || 600;
      widthRef.current = w;
      setWidth(w);
    });
    ro.observe(el);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(el);

    return () => {
      ro.disconnect();
      io.disconnect();
      stop();
    };
  }, [reduced]);

  if (reduced) {
    // Static waving pose, no animation loops.
    return (
      <div className="relative h-[140px] w-full overflow-hidden">
        <svg viewBox="0 0 200 140" className="absolute inset-0 h-full w-full" aria-hidden>
          <g transform="translate(100 74)" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" fill="none">
            <circle cx={0} cy={-32} r={10} />
            <line x1={0} y1={-22} x2={0} y2={8} />
            <line x1={0} y1={-16} x2={Math.sin(0.25) * ARM_LEN} y2={-16 + Math.cos(0.25) * ARM_LEN} />
            <line x1={0} y1={-16} x2={Math.sin(-2.2) * ARM_LEN} y2={-16 + Math.cos(-2.2) * ARM_LEN} />
            <line x1={0} y1={8} x2={Math.sin(0.14) * LEG_LEN} y2={8 + Math.cos(0.14) * LEG_LEN} />
            <line x1={0} y1={8} x2={Math.sin(-0.14) * LEG_LEN} y2={8 + Math.cos(-0.14) * LEG_LEN} />
            <circle cx={-3.5} cy={-33.5} r={1.3} fill="currentColor" stroke="none" />
            <circle cx={3.5} cy={-33.5} r={1.3} fill="currentColor" stroke="none" />
            <path d="M -4 -29 Q 0 -25.4 4 -29" strokeWidth={1.5} />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-[140px] w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} 140`} className="absolute inset-0 h-full w-full" aria-hidden>
        <g ref={gRef} stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" fill="none" opacity={0}>
          <circle cx={0} cy={-32} r={10} />
          <line x1={0} y1={-22} x2={0} y2={8} />
          <line ref={armLRef} x1={0} y1={-16} x2={3} y2={2} />
          <line ref={armRRef} x1={0} y1={-16} x2={-3} y2={2} />
          <line ref={legLRef} x1={0} y1={8} x2={3} y2={30} />
          <line ref={legRRef} x1={0} y1={8} x2={-3} y2={30} />
          <circle ref={eyeLRef} cx={-3.5} cy={-33.5} r={1.3} fill="currentColor" stroke="none" />
          <circle ref={eyeRRef} cx={3.5} cy={-33.5} r={1.3} fill="currentColor" stroke="none" />
          <path ref={mouthRef} d="M -4 -29 Q 0 -26.75 4 -29" strokeWidth={1.5} />
        </g>
      </svg>
    </div>
  );
}
