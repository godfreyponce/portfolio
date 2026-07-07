"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import CarouselArrow from "@/components/ui/CarouselArrow";

export interface MediaItem {
  type: "image" | "youtube";
  src: string;
  alt?: string;
  videoId?: string;
  fit?: "cover" | "contain";
}

interface MediaCarouselProps {
  items: MediaItem[];
  title: string;
}

const IMAGE_SIZES = "(max-width: 767px) 100vw, 500px";

export default function MediaCarousel({ items, title }: MediaCarouselProps) {
  const [current, setCurrent] = useState(0);
  const reduced = useReducedMotion();

  if (!items || items.length === 0) return null;

  const goTo = (index: number) => {
    setCurrent((index + items.length) % items.length);
  };

  const hasMultiple = items.length > 1;

  return (
    <div className="group/carousel relative h-full w-full">
      <div className="relative h-full w-full overflow-hidden">
        {/* All image slides stay mounted so they preload; the active one crossfades in. */}
        {items.map((item, i) => {
          const active = i === current;
          return (
            <motion.div
              key={`${item.src}-${i}`}
              className={`absolute inset-0 ${active ? "" : "pointer-events-none"}`}
              initial={false}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              aria-hidden={!active}
            >
              {item.type === "youtube" && item.videoId ? (
                active ? (
                  <iframe
                    className="h-full w-full border-0"
                    src={`https://www.youtube.com/embed/${item.videoId}?autoplay=0&mute=1&controls=1&loop=1&playlist=${item.videoId}`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : null
              ) : item.src ? (
                item.fit === "contain" ? (
                  <>
                    <Image
                      src={item.src}
                      alt=""
                      aria-hidden
                      fill
                      className="scale-110 object-cover opacity-30 blur-2xl"
                      quality={30}
                      sizes={IMAGE_SIZES}
                    />
                    <Image
                      src={item.src}
                      alt={item.alt || title}
                      fill
                      className="object-contain p-6"
                      quality={90}
                      sizes={IMAGE_SIZES}
                    />
                  </>
                ) : (
                  <Image
                    src={item.src}
                    alt={item.alt || title}
                    fill
                    className="object-cover"
                    quality={90}
                    sizes={IMAGE_SIZES}
                  />
                )
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-faint">
                  <ImageIcon size={36} strokeWidth={1.5} />
                  <span className="text-xs font-mono uppercase tracking-widest opacity-60">
                    {item.alt || "Drop image here"}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
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
