"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import CarouselArrow from "@/components/ui/CarouselArrow";

export interface MediaItem {
  type: "image" | "youtube";
  src: string;
  alt?: string;
  videoId?: string;
}

interface MediaCarouselProps {
  items: MediaItem[];
  title: string;
}

export default function MediaCarousel({ items, title }: MediaCarouselProps) {
  const [current, setCurrent] = useState(0);

  if (!items || items.length === 0) return null;

  const goTo = (index: number) => {
    setCurrent((index + items.length) % items.length);
  };

  const item = items[current];
  const hasMultiple = items.length > 1;

  return (
    <div className="group/carousel relative h-full w-full">
      <div className="relative h-full w-full">
        {item.type === "youtube" && item.videoId ? (
          <iframe
            className="h-full w-full border-0"
            src={`https://www.youtube.com/embed/${item.videoId}?autoplay=0&mute=1&controls=1&loop=1&playlist=${item.videoId}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : item.src ? (
          <Image
            src={item.src}
            alt={item.alt || title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-faint">
            <ImageIcon size={36} strokeWidth={1.5} />
            <span className="text-xs font-mono uppercase tracking-widest opacity-60">
              {item.alt || "Drop image here"}
            </span>
          </div>
        )}
      </div>

      {hasMultiple && (
        <>
          <CarouselArrow direction="prev" onClick={() => goTo(current - 1)} />
          <CarouselArrow direction="next" onClick={() => goTo(current + 1)} />

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === current ? "w-4 bg-ink" : "w-1.5 bg-ink-faint hover:bg-ink-subtle"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
