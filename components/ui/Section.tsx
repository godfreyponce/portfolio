import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

export default function Section({ id, className = "", children }: SectionProps) {
  return (
    <section id={id} className={`w-full max-w-[960px] mx-auto px-6 py-24 ${className}`}>
      {children}
    </section>
  );
}
