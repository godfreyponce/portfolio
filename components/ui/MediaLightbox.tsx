"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { IMAGE_SIZES as CAROUSEL_SIZES, type MediaItem } from "@/components/ui/MediaCarousel";

interface MediaLightboxProps {
  items: MediaItem[];
  title: string;
  startIndex: number;
  onClose: (index: number) => void;
}

// Everything the Tab trap should cycle through. iframe included: browsers put embeds in the
// tab order, and skipping it would let Tab walk out of the dialog.
const FOCUSABLE = 'button, a[href], iframe, [tabindex]:not([tabindex="-1"])';

// The stage is the panel width less its padding, capped by the panel's own max width.
const IMAGE_SIZES = "(max-width: 1200px) 92vw, 1100px";

// CarouselArrow's chrome, copied rather than reused: its opacity-0 /
// group-hover/carousel:opacity-100 pair hangs off the carousel's group class, which does not
// exist inside the overlay, so the buttons would never appear.
const BUTTON =
  "flex h-8 w-8 items-center justify-center rounded-full border border-rule bg-surface-raised/80 text-ink-muted outline-none backdrop-blur-sm transition-colors hover:bg-surface-raised focus-visible:ring-2 focus-visible:ring-ink/40";

// The image stage is two layers in one fill + object-contain box. The bottom one is the exact
// request the carousel already made (same src, same sizes, same quality), so it comes from the
// browser cache and paints on the first frame. The top one is the large render, held invisible
// until it lands and then faded in: a silent sharpen, no spinner. Same box, so nothing moves.
// Own component so `sharp` resets with the slide: the parent keys it by index.
// CAROUSEL_SIZES must stay the carousel's own string; any other value misses the cache and
// the first frame goes back to blank, silently.
function ImageStage({
  item,
  title,
  reduced,
}: {
  item: MediaItem;
  title: string;
  reduced: boolean | null;
}) {
  const [sharp, setSharp] = useState(false);
  return (
    <>
      <Image
        src={item.src}
        alt=""
        aria-hidden
        fill
        draggable={false}
        className="object-contain"
        quality={90}
        sizes={CAROUSEL_SIZES}
      />
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: sharp ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.15 }}
      >
        <Image
          src={item.src}
          alt={item.alt || title}
          fill
          draggable={false}
          className="object-contain"
          quality={90}
          sizes={IMAGE_SIZES}
          fetchPriority="high"
          onLoad={() => setSharp(true)}
        />
      </motion.div>
    </>
  );
}

export default function MediaLightbox({ items, title, startIndex, onClose }: MediaLightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const reduced = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const count = items.length;
  const item = items[index];

  // Freshest values for the document-level key handler without re-binding it every render.
  const state = useRef({ index, count, onClose });
  state.current = { index, count, onClose };

  // Page scroll lock while open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Initial focus, Escape, arrow paging, Tab trap. Document-level so the keys work wherever
  // focus sits inside the dialog. Known limit: while focus is inside the YouTube iframe the
  // page cannot see keydown; Escape works again as soon as focus tabs back out.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      const s = state.current;
      if (e.key === "Escape") {
        e.preventDefault();
        s.onClose(s.index);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setIndex((i) => Math.min(s.count - 1, i + 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const nodes = Array.from(
          dialog.querySelectorAll<HTMLElement>(FOCUSABLE),
        );
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !dialog.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (
          !e.shiftKey &&
          (active === last || !dialog.contains(active))
        ) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} slideshow`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(index);
      }}
    >
      <div className="relative flex max-h-[90vh] w-[min(1100px,92vw)] flex-col overflow-hidden rounded-lg border border-rule bg-surface-raised shadow-lift">
        <button
          ref={closeRef}
          type="button"
          onClick={() => onClose(index)}
          aria-label="Close slideshow"
          className={`${BUTTON} absolute right-3 top-3 z-20`}
        >
          <X size={16} />
        </button>

        <div className="relative flex h-[56vh] min-h-0 items-center justify-center bg-surface-sunken p-4 sm:h-[70vh] sm:p-5">
          {/* Neighbour preload: a rolling window of one slide either side, fetched at low priority
              with the large layer's exact srcset and sizes so the browser resolves the same URL the
              stage will ask for. Real image elements, not a hand-built URL: the candidate depends on
              viewport and DPR, and only the browser's own pick is guaranteed to match. Eager because
              next/image defaults to lazy; opacity rather than display:none so fill keeps a box. */}
          {[index - 1, index + 1]
            .filter((i) => i >= 0 && i < count)
            .map((i) => {
              const n = items[i];
              if ((n.type === "youtube" && n.videoId) || !n.src) return null;
              return (
                <Image
                  key={i}
                  src={n.src}
                  alt=""
                  aria-hidden
                  fill
                  draggable={false}
                  loading="eager"
                  fetchPriority="low"
                  className="pointer-events-none opacity-0"
                  quality={90}
                  sizes={IMAGE_SIZES}
                />
              );
            })}

          {/* Opacity only, never transform, so reduced motion is met by zeroing the duration
              rather than by a second code path. */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.15 }}
              className="relative flex h-full w-full items-center justify-center"
            >
              {item.type === "youtube" && item.videoId ? (
                <iframe
                  className="aspect-video max-h-full w-full max-w-[1000px] border-0"
                  src={`https://www.youtube.com/embed/${item.videoId}?autoplay=0&mute=1&controls=1&loop=1&playlist=${item.videoId}`}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : item.src ? (
                <ImageStage item={item} title={title} reduced={reduced} />
              ) : (
                <div className="flex flex-col items-center gap-2 text-ink-faint">
                  <ImageIcon size={36} strokeWidth={1.5} />
                  <span className="font-mono text-xs uppercase tracking-widest opacity-60">
                    {item.alt || "Drop image here"}
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {index > 0 && (
            <button
              type="button"
              onClick={() => setIndex(index - 1)}
              aria-label="Previous slide"
              className={`${BUTTON} absolute left-3 top-1/2 z-10 -translate-y-1/2`}
            >
              <ChevronLeft size={16} />
            </button>
          )}
          {index < count - 1 && (
            <button
              type="button"
              onClick={() => setIndex(index + 1)}
              aria-label="Next slide"
              className={`${BUTTON} absolute right-3 top-1/2 z-10 -translate-y-1/2`}
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        <div className="flex flex-none items-center justify-between gap-3 border-t border-rule px-4 py-3">
          <span className="truncate text-sm font-medium text-ink">{title}</span>
          <span className="flex-none text-xs tabular-nums text-ink-subtle">
            {index + 1} / {count}
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
