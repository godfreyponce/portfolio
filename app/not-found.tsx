import Link from "next/link";
import type { Metadata } from "next";
import NotFoundCounter from "@/components/NotFoundCounter";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center text-center">
      <div className="px-6">
        <NotFoundCounter />
        <p className="mt-4 text-[17px] text-ink-muted">The page you&apos;re looking for ran off.</p>
        <Link
          href="/"
          className="mt-4 inline-block text-ink underline decoration-ink-faint underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
        >
          Back to the homepage
        </Link>
      </div>
      <div className="relative mt-2 h-[140px] w-full overflow-hidden">
        <div className="absolute inset-x-0 top-[104px] border-t border-rule" />
        <div className="nf-runner absolute left-0 top-0">
          <svg viewBox="0 0 200 140" className="h-[140px] w-[200px]" aria-hidden>
            <g className="nf-p1" transform="translate(60 71) rotate(12 0 -8)" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" fill="none">
              <circle cx={0} cy={-32} r={10} />
              <line x1={0} y1={-22} x2={0} y2={8} />
              <line x1={0} y1={-16} x2={-11.32} y2={-2} />
              <line x1={0} y1={-16} x2={11.32} y2={-2} />
              <line x1={0} y1={8} x2={16.53} y2={22.52} />
              <line x1={0} y1={8} x2={-16.53} y2={22.52} />
              <circle cx={-1.5} cy={-33.5} r={1.3} fill="currentColor" stroke="none" />
              <circle cx={5.5} cy={-33.5} r={1.3} fill="currentColor" stroke="none" />
              <path d="M -4 -29 Q 0 -26.3 4 -29" strokeWidth={1.5} />
            </g>
            <g className="nf-p2" transform="translate(60 74) rotate(12 0 -8)" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" fill="none" opacity={0}>
              <circle cx={0} cy={-32} r={10} />
              <line x1={0} y1={-22} x2={0} y2={8} />
              <line x1={0} y1={-16} x2={-2.15} y2={1.87} />
              <line x1={0} y1={-16} x2={2.15} y2={1.87} />
              <line x1={0} y1={8} x2={3.29} y2={29.75} />
              <line x1={0} y1={8} x2={-3.29} y2={29.75} />
              <circle cx={-1.5} cy={-33.5} r={1.3} fill="currentColor" stroke="none" />
              <circle cx={5.5} cy={-33.5} r={1.3} fill="currentColor" stroke="none" />
              <path d="M -4 -29 Q 0 -26.3 4 -29" strokeWidth={1.5} />
            </g>
            <g className="nf-page">
              <rect x={132} y={80} width={18} height={24} rx={2} className="fill-surface-raised stroke-ink-faint" strokeWidth={1.5} />
              <path d="M 144 80 L 150 86 L 144 86 Z" className="fill-rule stroke-ink-faint" strokeWidth={1} strokeLinejoin="round" />
              <circle cx={138} cy={90} r={1} fill="currentColor" />
              <circle cx={143} cy={90} r={1} fill="currentColor" />
            </g>
            <g className="nf-stand" transform="translate(100 74)" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" fill="none">
              <circle cx={0} cy={-32} r={10} />
              <line x1={0} y1={-22} x2={0} y2={8} />
              <line x1={0} y1={-16} x2={4.45} y2={1.44} />
              <line x1={0} y1={-16} x2={-14.55} y2={-26.59} />
              <line x1={0} y1={8} x2={3.07} y2={29.79} />
              <line x1={0} y1={8} x2={-3.07} y2={29.79} />
              <circle cx={-3.5} cy={-33.5} r={1.3} fill="currentColor" stroke="none" />
              <circle cx={3.5} cy={-33.5} r={1.3} fill="currentColor" stroke="none" />
              <path d="M -4 -29 Q 0 -25.4 4 -29" strokeWidth={1.5} />
            </g>
          </svg>
        </div>
      </div>
    </main>
  );
}
