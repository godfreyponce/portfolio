"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { motion, useMotionValue, animate, useReducedMotion, type PanInfo } from "framer-motion";
import CarouselArrow from "@/components/ui/CarouselArrow";
import MediaLightbox from "@/components/ui/MediaLightbox";

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
  /** Opt in to click-to-enlarge. Off on the homepage card, on for the /projects row (#49). */
  expandable?: boolean;
}

const IMAGE_SIZES = "(max-width: 767px) 100vw, 500px";

// Swipe release: Framer Motion's image-gallery example (|offset.x| * velocity.x beyond 10000),
// plus a distance fallback for slow drags (guess: half a slide).
const SWIPE_POWER = 10000;
const SWIPE_DISTANCE = 0.5;
// Snap spring: same Framer example.
const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;
// How far the track can be pulled past the ends (guess; Framer default 0.5 feels broken).
const DRAG_ELASTIC = 0.2;
// Trackpad: sum of deltaX that counts as intent (guess, checked in the #47 preview), and the
// silence that ends a gesture so macOS momentum events cannot fire a second slide
// (guess, must exceed the max gap between wheel events inside one swipe; preview readout).
const WHEEL_FIRE_PX = 40;
const WHEEL_QUIET_MS = 150;

export default function MediaCarousel({ items, title, expandable }: MediaCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [maxDrag, setMaxDrag] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  // A click that ends a drag must not open the lightbox. Set on drag/pan start, cleared a tick
  // after settle so the trailing click still sees it.
  const dragged = useRef(false);
  const slideButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const idx = useRef(0);
  const step = useRef(0);
  const wheel = useRef({ acc: 0, locked: false, last: 0 });

  const count = items?.length ?? 0;
  const hasMultiple = count > 1;

  const snap = (index: number) => {
    const target = Math.max(0, Math.min(count - 1, index));
    idx.current = target;
    setCurrent(target);
    animate(x, -target * step.current, reduced ? { duration: 0 } : SPRING);
  };
  const snapRef = useRef(snap);
  snapRef.current = snap;

  // Measure the distance between slides (slide width plus the gap) and keep the track aligned
  // when the container resizes. maxDrag feeds dragConstraints: the track is a flex container
  // whose slides overflow it, so its own box stays viewport-sized and a ref-based
  // dragConstraints would measure a zero-width range and pin the track in place.
  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const measure = () => {
      const slides = track.children;
      step.current =
        slides.length > 1
          ? (slides[1] as HTMLElement).offsetLeft - (slides[0] as HTMLElement).offsetLeft
          : viewport.clientWidth;
      setMaxDrag((count - 1) * step.current);
      x.set(-idx.current * step.current);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    measure();
    return () => ro.disconnect();
  }, [x, count]);

  // Trackpad. Native listener because React's onWheel is passive and preventDefault (which
  // stops the browser's back/forward swipe) would be ignored.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !hasMultiple) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // vertical intent: let the page scroll
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
        snapRef.current(idx.current + Math.sign(w.acc));
      }
    };
    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [hasMultiple]);

  if (!items || items.length === 0) return null;

  const settle = (_: unknown, info: PanInfo) => {
    const power = Math.abs(info.offset.x) * info.velocity.x;
    const far = Math.abs(info.offset.x) > step.current * SWIPE_DISTANCE;
    if (power < -SWIPE_POWER || (far && info.offset.x < 0)) snap(idx.current + 1);
    else if (power > SWIPE_POWER || (far && info.offset.x > 0)) snap(idx.current - 1);
    else snap(idx.current);
    setTimeout(() => {
      dragged.current = false;
    }, 0);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // The lightbox portal is a React child of this element, and portal events bubble through
    // the React tree, not the DOM tree: without this the overlay's arrow keys would page the
    // carousel underneath too.
    if (lightbox !== null) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      snap(idx.current + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      snap(idx.current - 1);
    }
  };

  return (
    <div
      className="group/carousel relative h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
      role="region"
      aria-roledescription="carousel"
      aria-label={title}
      tabIndex={hasMultiple ? 0 : undefined}
      onKeyDown={hasMultiple ? onKeyDown : undefined}
    >
      <div ref={viewportRef} className="relative h-full w-full overflow-hidden">
        {/* All slides stay mounted so images preload; the track slides horizontally. Every slide
            fills the frame: the #47 peek gutters read as a clipped slab in the homepage card's
            half-width column, so they came back out (#48). */}
        <motion.div
          ref={trackRef}
          className="flex h-full"
          style={{ x, touchAction: "pan-y" }}
          drag={hasMultiple && !reduced ? "x" : false}
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragElastic={DRAG_ELASTIC}
          dragMomentum={false}
          onDragStart={() => {
            dragged.current = true;
          }}
          onDragEnd={settle}
          onPanStart={hasMultiple && reduced ? () => { dragged.current = true; } : undefined}
          onPanEnd={hasMultiple && reduced ? settle : undefined}
        >
          {items.map((item, i) => {
            const active = i === current;
            const picture =
              item.fit === "contain" ? (
                <>
                  <Image
                    src={item.src}
                    alt=""
                    aria-hidden
                    fill
                    draggable={false}
                    className="scale-110 object-cover opacity-30 blur-2xl"
                    quality={30}
                    sizes={IMAGE_SIZES}
                  />
                  <Image
                    src={item.src}
                    alt={item.alt || title}
                    fill
                    draggable={false}
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
                  draggable={false}
                  className="object-cover"
                  quality={90}
                  sizes={IMAGE_SIZES}
                />
              );
            return (
              <div
                key={`${item.src}-${i}`}
                className={`relative h-full w-full shrink-0 select-none ${
                  active ? "" : "pointer-events-none"
                }`}
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
                  expandable ? (
                    <button
                      type="button"
                      ref={(el) => {
                        slideButtons.current[i] = el;
                      }}
                      tabIndex={active ? 0 : -1}
                      onClick={() => {
                        if (dragged.current) return;
                        setLightbox(i);
                      }}
                      aria-label={`Open ${item.alt || title} in a larger view`}
                      className="relative block h-full w-full cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink/40"
                    >
                      {picture}
                    </button>
                  ) : (
                    picture
                  )
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-faint">
                    <ImageIcon size={36} strokeWidth={1.5} />
                    <span className="text-xs font-mono uppercase tracking-widest opacity-60">
                      {item.alt || "Drop image here"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>

      {hasMultiple && (
        <>
          {current > 0 && <CarouselArrow direction="prev" onClick={() => snap(idx.current - 1)} />}
          {current < count - 1 && <CarouselArrow direction="next" onClick={() => snap(idx.current + 1)} />}

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => snap(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === current ? "w-4 bg-ink" : "w-1.5 bg-ink-faint hover:bg-ink-subtle"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {lightbox !== null && (
        <MediaLightbox
          items={items}
          title={title}
          startIndex={lightbox}
          onClose={(closeIndex) => {
            setLightbox(null);
            snap(closeIndex);
            // Every slide stays mounted, so the button to return focus to already exists and
            // this can run now. Deferring it to a frame would strand focus on <body> whenever
            // the tab is hidden, since requestAnimationFrame does not fire there.
            slideButtons.current[closeIndex]?.focus();
          }}
        />
      )}
    </div>
  );
}
