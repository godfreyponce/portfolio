"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ImageStage } from "@/components/ui/MediaLightbox";
import {
  SWIPE_DISTANCE,
  SWIPE_POWER,
  WHEEL_FIRE_PX,
  WHEEL_QUIET_MS,
  type MediaItem,
} from "@/components/ui/MediaCarousel";

interface SingleLightboxProps {
  items: MediaItem[];
  title: string;
  startIndex: number;
  onClose: (index: number) => void;
}

// The slides the carousel gives a zoom button: everything but a YouTube embed or an empty
// placeholder. Mirrors the render branch in MediaCarousel; paging steps over the rest.
const enlargeable = (m: MediaItem) => !(m.type === "youtube" && m.videoId) && Boolean(m.src);

// Crossfade between pictures. Same number as the card's entrance below.
const FADE_S = 0.2;

// One enlarged slide of the clicked card, paging within that card's images (#64, #73): the
// homepage Lab card's enlarge treatment. The /projects slideshow is MediaLightbox. Portaled
// because the Lab cards are scale-transformed sticky motion.divs, which would trap a fixed
// overlay.
export default function SingleLightbox({ items, title, startIndex, onClose }: SingleLightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const multiple = items.filter(enlargeable).length > 1;
  const item = items[index];

  // Freshest values for the document-level key handler without re-binding it every render.
  const state = useRef({ index, onClose });
  state.current = { index, onClose };

  // A pan released anywhere fires click on the common ancestor of the down and up targets,
  // which would read as a scrim click (close) or a picture click (page). Set on pan start,
  // cleared a tick after settle so the trailing click still sees it. Same trick as the
  // carousel's `dragged`.
  const dragged = useRef(false);
  const wheel = useRef({ acc: 0, locked: false, last: 0 });

  // Next zoomable slide in `dir`, stopping at the ends. `items` is the project's media array
  // from lib/projects.ts, so this identity is stable for the overlay's life.
  const page = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => {
        for (let j = i + dir; j >= 0 && j < items.length; j += dir) {
          if (enlargeable(items[j])) return j;
        }
        return i;
      });
    },
    [items],
  );

  // Page scroll lock while open. Same lock MediaLightbox uses.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Initial focus, Escape, arrow paging, and a one-control Tab trap: the close button is the
  // only focusable node, so keeping focus on it is a preventDefault. Document-level so the
  // keys work wherever focus sits. `multiple` and `page` are fixed for the mount, so this
  // binds once.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        state.current.onClose(state.current.index);
      } else if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
      } else if (multiple && e.key === "ArrowRight") {
        e.preventDefault();
        page(1);
      } else if (multiple && e.key === "ArrowLeft") {
        e.preventDefault();
        page(-1);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [multiple, page]);

  // Trackpad. With the page locked, a two-finger horizontal swipe over the overlay is the
  // browser's back/forward gesture unless the wheel event is cancelled, and React's onWheel
  // is passive, so this is a native listener. Same accumulate, fire once, lock until quiet
  // pattern and constants as the carousel and MediaLightbox: one macOS momentum burst is one
  // picture.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !multiple) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // vertical intent: not ours
      e.preventDefault();
      const w = wheel.current;
      if (e.timeStamp - w.last > WHEEL_QUIET_MS) {
        w.acc = 0;
        w.locked = false;
      }
      w.last = e.timeStamp;
      if (w.locked) return;
      w.acc += e.deltaX;
      if (Math.abs(w.acc) >= WHEEL_FIRE_PX) {
        w.locked = true;
        page(w.acc > 0 ? 1 : -1);
      }
    };
    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [multiple, page]);

  // Touch and mouse. Flip on release, never follow the finger: no `drag`, no motion value,
  // just the carousel's release thresholds read off the pan summary. Same as MediaLightbox.
  const settle = (_: unknown, info: PanInfo) => {
    setTimeout(() => {
      dragged.current = false;
    }, 0);
    if (Math.abs(info.offset.x) <= Math.abs(info.offset.y)) return; // vertical intent
    const width = rootRef.current?.clientWidth ?? Infinity;
    const power = Math.abs(info.offset.x) * info.velocity.x;
    const far = Math.abs(info.offset.x) > width * SWIPE_DISTANCE;
    if (power < -SWIPE_POWER || (far && info.offset.x < 0)) page(1);
    else if (power > SWIPE_POWER || (far && info.offset.x > 0)) page(-1);
  };

  // Click zones: right half next, left half previous, measured on the stage box (the picture
  // sits object-contain inside it, so a letterbox gutter counts as its side). Stops the
  // bubble either way so a picture click never reaches the closing root.
  const onStageClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (dragged.current) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    page(e.clientX < left + width / 2 ? -1 : 1);
  };

  const label = item.alt || title;

  return createPortal(
    <motion.div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Enlarged image: ${label}`}
      onClick={() => {
        if (!dragged.current) onClose(index);
      }}
      onPanStart={
        multiple
          ? () => {
              dragged.current = true;
            }
          : undefined
      }
      onPanEnd={multiple ? settle : undefined}
      className={`fixed inset-0 z-50 flex cursor-zoom-out flex-col items-center justify-center bg-ink/40 p-4 sm:p-6 ${
        multiple ? "touch-none" : ""
      }`}
    >
      {/* The card is what drops in, so the transform lives here rather than on the stage: the
          owner picked the whole card tilting, not the picture tilting inside a still card.
          Never on the fixed root, which must not carry a transform of its own. */}
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.97, rotate: -1.5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: reduced ? 0 : FADE_S }}
        className="relative flex flex-col gap-3 border border-rule bg-surface-raised p-3 shadow-lift sm:p-4"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose(index);
          }}
          aria-label="Close enlarged image"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center text-ink-muted outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
        >
          <X size={20} />
        </button>

        {/* ImageStage is two `fill` images, so the box needs its own size. Sized in vw/vh
            because next/image `fill` has no natural size to read before load; object-contain
            inside it is what keeps the picture whole at every viewport. Each picture is an
            absolute layer keyed by index: AnimatePresence's default sync mode keeps the old
            layer fading out under the new one fading in, a crossfade, and the new layer's
            bottom image is the carousel's cached request, so it paints on the first frame. */}
        <div
          onClick={multiple ? onStageClick : undefined}
          className={`relative h-[78vh] w-[88vw] bg-surface-sunken ${multiple ? "cursor-default" : ""}`}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={index}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: reduced ? 0 : FADE_S }}
              className="absolute inset-0"
            >
              {item.type === "video" ? (
                <video
                  src={item.src}
                  poster={item.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label={label}
                  className="h-full w-full object-contain"
                />
              ) : (
                <ImageStage item={item} title={title} reduced={reduced} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <span className="max-w-[88vw] truncate font-display text-sm text-ink-muted">
          {label}
        </span>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
