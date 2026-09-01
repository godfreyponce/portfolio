"use client";

/*
 * Hero tagline hover scramble (#37): per-letter spans; mouseenter writes a
 * randomly picked palette color into the span's --scramble-color (direct
 * DOM write, no state), mouseleave removes it. CSS does the snap-in and
 * the eased decay (see .scramble-letter in globals.css), and only consumes
 * the var when reduced motion is not requested. Colors re-randomize on
 * every pass, matching the cmrg.me reference. Screen readers get the
 * intact sentence via the sr-only copy; the letter spans are aria-hidden.
 */

const SCRAMBLE_PALETTE = ["#f00013", "#a67600", "#6e8e00", "#566dff"];

function randomScrambleColor() {
  return SCRAMBLE_PALETTE[Math.floor(Math.random() * SCRAMBLE_PALETTE.length)];
}

export default function ScrambleText({ text }: { text: string }) {
  return (
    <>
      {/* select-none keeps this copy out of the clipboard: without it,
          selecting the tagline yields the sentence twice. */}
      <span className="sr-only select-none">{text}</span>
      <span className="scramble-line" aria-hidden="true">
        {text.split("").map((ch, i) =>
          ch === " " ? (
            <span key={i}> </span>
          ) : (
            <span
              key={i}
              className="scramble-letter"
              onMouseEnter={(e) =>
                e.currentTarget.style.setProperty(
                  "--scramble-color",
                  randomScrambleColor()
                )
              }
              onMouseLeave={(e) =>
                e.currentTarget.style.removeProperty("--scramble-color")
              }
            >
              {ch}
            </span>
          )
        )}
      </span>
    </>
  );
}
