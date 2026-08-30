import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  tabIndex?: number;
}

export default function Badge({ children, className = "", tabIndex }: BadgeProps) {
  return (
    <span
      tabIndex={tabIndex}
      className={`inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium border border-rule text-ink-subtle ${className}`}
    >
      {children}
    </span>
  );
}
