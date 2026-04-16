"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Phase = "idle" | "runIn" | "pause1" | "wave" | "pause2" | "runOut" | "done";

const TIMING = {
  runIn: 2200,
  pause1: 200,
  wave: 2200,
  pause2: 200,
  runOut: 1800,
} as const;

const TOTAL =
  TIMING.runIn + TIMING.pause1 + TIMING.wave + TIMING.pause2 + TIMING.runOut;

function getPhase(elapsed: number): { phase: Phase; phaseElapsed: number } {
  if (elapsed < 0) return { phase: "idle", phaseElapsed: 0 };

  let t = elapsed;
  if (t < TIMING.runIn) return { phase: "runIn", phaseElapsed: t };
  t -= TIMING.runIn;
  if (t < TIMING.pause1) return { phase: "pause1", phaseElapsed: t };
  t -= TIMING.pause1;
  if (t < TIMING.wave) return { phase: "wave", phaseElapsed: t };
  t -= TIMING.wave;
  if (t < TIMING.pause2) return { phase: "pause2", phaseElapsed: t };
  t -= TIMING.pause2;
  if (t < TIMING.runOut) return { phase: "runOut", phaseElapsed: t };
  return { phase: "done", phaseElapsed: 0 };
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

interface StickFigure {
  x: number;
  y: number;
  leftArmAngle: number;
  rightArmAngle: number;
  leftLegAngle: number;
  rightLegAngle: number;
  mouthCurve: number;
  eyeScale: number;
}

function computeFigure(elapsed: number, width: number): StickFigure | null {
  const { phase, phaseElapsed } = getPhase(elapsed);

  if (phase === "idle" || phase === "done") return null;

  const centerX = width / 2;
  const baseY = 70;
  const swingAmp = 0.55;
  const bobAmp = 3;
  const runSpeed = 12;

  const fig: StickFigure = {
    x: centerX,
    y: baseY,
    leftArmAngle: 0,
    rightArmAngle: 0,
    leftLegAngle: 0,
    rightLegAngle: 0,
    mouthCurve: 0.5,
    eyeScale: 1,
  };

  if (phase === "runIn") {
    const progress = easeInOut(Math.min(phaseElapsed / TIMING.runIn, 1));
    const startX = -40;
    fig.x = startX + (centerX - startX) * progress;
    const t = phaseElapsed / 1000;
    fig.y = baseY - Math.abs(Math.sin(t * runSpeed)) * bobAmp;
    fig.leftArmAngle = Math.sin(t * runSpeed) * swingAmp;
    fig.rightArmAngle = -Math.sin(t * runSpeed) * swingAmp;
    fig.leftLegAngle = -Math.sin(t * runSpeed) * swingAmp;
    fig.rightLegAngle = Math.sin(t * runSpeed) * swingAmp;
    fig.mouthCurve = 0.3;
  } else if (phase === "pause1") {
    fig.x = centerX;
    fig.mouthCurve = 0.5;
  } else if (phase === "wave") {
    fig.x = centerX;
    const t = phaseElapsed / 1000;
    fig.rightArmAngle = -2.2 + Math.sin(t * 8) * 0.35;
    fig.leftArmAngle = 0.15;
    fig.mouthCurve = 0.7 + Math.sin(t * 4) * 0.15;
    fig.eyeScale = 1.15;
    fig.y = baseY - Math.sin(t * 3) * 1.5;
  } else if (phase === "pause2") {
    fig.x = centerX;
    fig.mouthCurve = 0.5;
  } else if (phase === "runOut") {
    const progress = easeInOut(Math.min(phaseElapsed / TIMING.runOut, 1));
    const endX = width + 40;
    fig.x = centerX + (endX - centerX) * progress;
    const t = phaseElapsed / 1000;
    fig.y = baseY - Math.abs(Math.sin(t * runSpeed)) * bobAmp;
    fig.leftArmAngle = Math.sin(t * runSpeed) * swingAmp;
    fig.rightArmAngle = -Math.sin(t * runSpeed) * swingAmp;
    fig.leftLegAngle = -Math.sin(t * runSpeed) * swingAmp;
    fig.rightLegAngle = Math.sin(t * runSpeed) * swingAmp;
    fig.mouthCurve = 0.3;
  }

  return fig;
}

function renderFigure(fig: StickFigure): React.ReactNode {
  const { x, y, leftArmAngle, rightArmAngle, leftLegAngle, rightLegAngle, mouthCurve, eyeScale } = fig;

  const headR = 10;
  const headY = y - 32;
  const neckY = headY + headR;
  const bodyEnd = y + 8;
  const shoulderY = neckY + 6;
  const armLen = 18;
  const legLen = 22;
  const hipY = bodyEnd;

  const lax = x + Math.sin(leftArmAngle) * armLen;
  const lay = shoulderY + Math.cos(leftArmAngle) * armLen;
  const rax = x + Math.sin(rightArmAngle) * armLen;
  const ray = shoulderY + Math.cos(rightArmAngle) * armLen;

  const llx = x + Math.sin(leftLegAngle) * legLen;
  const lly = hipY + Math.cos(leftLegAngle) * legLen;
  const rlx = x + Math.sin(rightLegAngle) * legLen;
  const rly = hipY + Math.cos(rightLegAngle) * legLen;

  const eyeOff = 3.5;
  const eyeR = 1.3 * eyeScale;

  const smileCp = mouthCurve * 4;

  return (
    <g stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" fill="none">
      <circle cx={x} cy={headY} r={headR} />
      <line x1={x} y1={neckY} x2={x} y2={bodyEnd} />
      <line x1={x} y1={shoulderY} x2={lax} y2={lay} />
      <line x1={x} y1={shoulderY} x2={rax} y2={ray} />
      <line x1={x} y1={hipY} x2={llx} y2={lly} />
      <line x1={x} y1={hipY} x2={rlx} y2={rly} />
      <circle cx={x - eyeOff} cy={headY - 1.5} r={eyeR} fill="currentColor" stroke="none" />
      <circle cx={x + eyeOff} cy={headY - 1.5} r={eyeR} fill="currentColor" stroke="none" />
      <path
        d={`M ${x - 4} ${headY + 3} Q ${x} ${headY + 3 + smileCp} ${x + 4} ${headY + 3}`}
        strokeWidth={1.5}
      />
    </g>
  );
}

export default function StickmanRunner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const hasTriggered = useRef(false);
  const [figure, setFigure] = useState<StickFigure | null>(null);
  const [containerWidth, setContainerWidth] = useState(600);

  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      const w = containerRef.current?.offsetWidth ?? 600;
      setContainerWidth(w);

      const fig = computeFigure(elapsed, w);
      setFigure(fig);

      if (elapsed < TOTAL) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setFigure(null);
      }
    },
    [],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          rafRef.current = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  return (
    <div ref={containerRef} className="relative h-[140px] w-full overflow-hidden">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${containerWidth} 140`}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {figure && renderFigure(figure)}
      </svg>
    </div>
  );
}
