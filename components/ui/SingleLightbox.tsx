"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { ImageStage } from "@/components/ui/MediaLightbox";
import { type MediaItem } from "@/components/ui/MediaCarousel";

interface SingleLightboxProps {
  item: MediaItem;
  title: string;
  onClose: () => void;
}

// One enlarged slide, no paging: the homepage Lab card's enlarge treatment (#64). The
// /projects slideshow is MediaLightbox. Portaled because the Lab cards are scale-transformed
// sticky motion.divs, which would trap a fixed overlay.
export default function SingleLightbox({ item, title, onClose }: SingleLightboxProps) {
  const reduced = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Page scroll lock while open. Same lock MediaLightbox uses.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Initial focus, Escape, and a one-control Tab trap: the close button is the only focusable
  // node, so keeping focus on it is a preventDefault. Document-level so Escape works wherever
  // focus sits.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
      } else if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const label = item.alt || title;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Enlarged image: ${label}`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex cursor-zoom-out flex-col items-center justify-center bg-ink/40 p-4 sm:p-6"
    >
      {/* The card is what drops in, so the transform lives here rather than on the stage: the
          owner picked the whole card tilting, not the picture tilting inside a still card.
          Never on the fixed root, which must not carry a transform of its own. */}
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.97, rotate: -1.5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: reduced ? 0 : 0.2 }}
        className="relative flex flex-col gap-3 border border-rule bg-surface-raised p-3 shadow-lift sm:p-4"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close enlarged image"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center text-ink-muted outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
        >
          <X size={20} />
        </button>

        {/* ImageStage is two `fill` images, so the box needs its own size. Sized in vw/vh
            because next/image `fill` has no natural size to read before load; object-contain
            inside it is what keeps the picture whole at every viewport. */}
        <div className="relative h-[78vh] w-[88vw] bg-surface-sunken">
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
        </div>

        <span className="max-w-[88vw] truncate font-display text-sm text-ink-muted">
          {label}
        </span>
      </motion.div>
    </div>,
    document.body,
  );
}
