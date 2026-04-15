import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  width?: "narrow" | "wide";
  className?: string;
  children: ReactNode;
}

export default function Section({ id, width = "narrow", className = "", children }: SectionProps) {
  const max = width === "wide" ? "max-w-6xl" : "max-w-3xl";
  return (
    <section id={id} className={`w-full ${max} mx-auto px-6 ${className}`}>
      {children}
    </section>
  );
}
