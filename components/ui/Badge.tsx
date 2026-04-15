import type { ReactNode } from "react";

export type BadgeTone = "neutral" | "live" | "building" | "hackathon" | "project";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const toneStyles: Record<BadgeTone, string> = {
  neutral: "bg-rule-soft text-ink-subtle border-rule",
  live: "bg-emerald-50 text-emerald-700 border-emerald-200",
  building: "bg-amber-50 text-amber-700 border-amber-200",
  hackathon: "bg-violet-50 text-violet-700 border-violet-200",
  project: "bg-sky-50 text-sky-700 border-sky-200",
};

export default function Badge({ children, tone = "neutral", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2 py-1 text-xs font-medium ${toneStyles[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
