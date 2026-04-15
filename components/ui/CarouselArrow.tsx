import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselArrowProps {
  direction: "prev" | "next";
  onClick: () => void;
}

export default function CarouselArrow({ direction, onClick }: CarouselArrowProps) {
  const isPrev = direction === "prev";
  const Icon = isPrev ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      aria-label={isPrev ? "Previous slide" : "Next slide"}
      className={`absolute ${isPrev ? "left-2" : "right-2"} top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-rule bg-surface-raised/80 opacity-0 backdrop-blur-sm transition-opacity hover:bg-surface-raised group-hover/carousel:opacity-100`}
    >
      <Icon size={16} className="text-ink-muted" />
    </button>
  );
}
