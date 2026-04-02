"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

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

  return (
    <div className="relative w-full h-full group/carousel">
      {/* Current Slide */}
      <div className="w-full h-full relative">
        {item.type === "youtube" && item.videoId ? (
          <iframe
            className="w-full h-full border-0"
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
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-300">
            <ImageIcon size={36} strokeWidth={1.5} />
            <span className="text-xs font-mono uppercase tracking-widest opacity-60">
              {item.alt || "Drop image here"}
            </span>
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={() => goTo(current - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-zinc-200 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft size={16} className="text-zinc-700" />
          </button>
          <button
            onClick={() => goTo(current + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-zinc-200 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight size={16} className="text-zinc-700" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-zinc-800 w-4"
                  : "bg-zinc-400/60 hover:bg-zinc-500"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
