# Handoff: GitHub profile README — chafa ASCII portrait + neofetch panel

**Status:** WIP, portrait phase. Owner rejected the head-only crop (2026-07-17) — see "Owner directives".
This doc is the fallback ticket because `git`/`gh` are blocked by the macOS TCC issue (see "Env gotcha").
File a GitHub issue from this once Desktop access is restored (`gh issue create -F docs/readme-portrait-handoff.md`).

## Goal
Rebuild the profile README to look like **Andrew6rant**'s: a chafa-generated portrait of the owner on
the left, a neofetch-style info panel on the right (OS / languages / stats).

- **Deliverable repo:** `godfreyponce/GodfreyPonce` (PUBLIC), file `readme.md`, branch `main`.
  This is NOT the personalWebsite repo — we only track/prototype here.
- **Source photo:** `public/godfrey_headShot.JPG` (1000×879) in THIS repo.

## How the reference actually works (verified)
Andrew6rant's `README.md` is just a `<picture>` pointing at `dark_mode.svg` / `light_mode.svg`.
Each ASCII line is a `<tspan>` in 16px Consolas; portrait is one flat color (`#c9d1d9`) on a rounded
`#161b22` rect; the panel gets neofetch colors from CSS classes (orange keys `#ffa657`, blue values
`#a5d6ff`, green/red diff). A `today.py` on a cron Action refreshes his stat numbers.
**GitHub markdown strips ANSI color** → colored/half-block chafa in a ``` fence renders as garbage.
So: colored art and block-glyph art REQUIRE the SVG route. Pure ASCII/braille work in a fence OR SVG.

## Owner directives (do not violate)
1. **Portrait FIRST.** No info panel until the portrait is accepted.
2. **FULL framing — head + shoulders + polo, like the avatar.** The head-only crop was REJECTED
   ("doesn't capture my mouth or my shoulders and frame"). Match the avatar composition (Image #4).
   The **mouth must read.**
3. Variant workflow: 3 throwaway variants in `public/preview-*.html` (works at localhost:3000 AND
   file://), owner picks one, wire the winner into `readme.md`, then DELETE the preview file.
4. Owner wants to SEE variants rendered in HTML (GitHub-style card), not as raw terminal text.

## What's proven so far
- **Toolchain:** `chafa` 1.18.2 (brew), ImageMagick (`magick`), Swift + Vision framework all available.
- **Cutout:** Apple Vision subject-lift (see `lift.swift` below) cleanly removes the blurred-tree
  background — crisp hair edges, no halo. This is non-optional: raw, the hair dissolves into the trees.
- **Polarity:** `chafa --invert` = dark→ink (pencil-sketch). Composite cutout on WHITE; background→blank.
- **Luminance map of the subject (0–100%):** hair 3–8 · eyes ~26 · brows ~33 · skin 45–57 ·
  lips ~53 · **polo ~91** · bg 100. Implication: a global white-point that blanks skin ALSO blanks the
  near-white polo → shoulders vanish. That's why head-only "worked" but full-figure looked empty.

## THE NEXT STEP (start here)
Regenerate on the **FULL head+shoulders cutout** (`trimmed.png`, ~707×749, includes polo to chest).
Drive it with **CLAHE (local contrast) as the primary operator, NOT a global `-level` crush**, so the
polo's collar, placket, folds, and shoulder line render as ink OUTLINES (that's how the reference draws
a light shirt — outline + light shading, not a filled mass), while the face keeps eyes/brows/mouth.
Then produce A/B/C variants (ascii / block / braille) at full framing and preview in
`public/preview-readme.html`. Sizes: full figure is taller than head — give chafa a taller box.

Starting point to sweep from (tune CLAHE tile size/clip + a GENTLE high white point ~80–90%):
```
magick trimmed.png -background white -flatten -colorspace gray \
  -clahe 6x6%+128+4 -level 0%,88% fig_in.png
chafa fig_in.png --size 52x52 -c none --symbols ascii  --invert --preprocess off   # A
chafa fig_in.png --size 64x64 -c none --symbols block   --fg-only --invert --preprocess off  # B (SVG only)
chafa fig_in.png --size 56x56 -c none --symbols braille --fg-only --invert --preprocess off   # C
```
Verdict from head-only trials: **block (B)** is the most recognizable (clear eyes/brows/nose/mouth);
**braille (C)** is nearly as good AND fence-safe; **ASCII (A)** is truest to the reference but most
abstract. Re-judge at full framing.

## Reproduction
```
# 1. cutout (from repo root; needs macOS 26 + Swift)
swiftc -O lift.swift -o lift && ./lift public/godfrey_headShot.JPG cutout.png
# 2. trim to subject + small pad (KEEP shoulders/polo — do NOT crop to head)
magick cutout.png -trim +repage -bordercolor none -border 12 trimmed.png
# 3. preprocess + chafa (see NEXT STEP)
# 4. render variants into public/preview-readme.html (HTML with line-height:1 so blocks tile;
#    see gen_preview.py pattern — GitHub dark card: #0d1117 bg, #30363d border, #c9d1d9 text)
```

## lift.swift (Vision subject-lift → transparent PNG)
```swift
import Foundation
import Vision
import CoreImage

let args = CommandLine.arguments
guard args.count >= 3 else { FileHandle.standardError.write("usage: lift <in> <out.png>\n".data(using:.utf8)!); exit(1) }
guard let ciImage = CIImage(contentsOf: URL(fileURLWithPath: args[1])) else { exit(1) }
let request = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(ciImage: ciImage, options: [:])
try handler.perform([request])
guard let obs = request.results?.first else { FileHandle.standardError.write("no subject\n".data(using:.utf8)!); exit(1) }
let masked = try obs.generateMaskedImage(ofInstances: obs.allInstances, from: handler, croppedToInstancesExtent: false)
let ctx = CIContext()
try ctx.writePNGRepresentation(of: CIImage(cvPixelBuffer: masked),
    to: URL(fileURLWithPath: args[2]), format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
```

## Env gotcha (BLOCKING as of handoff)
`next dev` (:3000) and ALL of `git`/`gh`/`npm`/`node` fail with
`EPERM: process.cwd ... Operation not permitted` / `Unable to read current working directory` — macOS
TCC revoked Desktop access for the terminal/node. **Owner fix:** System Settings → Privacy & Security →
Files and Folders / Full Disk Access → re-allow the terminal app, then retry.
Workaround used for the preview: `python3 -m http.server 3001 --directory public` launched from a
`/private/tmp` cwd (so no process needs the blocked Desktop cwd) → view at
`http://localhost:3001/preview-readme.html`. `file://` works in a normal browser but is blocked by the
Chrome-automation tool.

## Files
- `public/godfrey_headShot.JPG` — source photo (durable).
- `public/preview-readme.html` — throwaway 3-variant preview (head-only, STALE after full-figure redo; delete once a variant ships).
- Scratchpad working files (lift binary, cutout/trimmed PNGs, sweep scripts, gen_preview.py, v1/v2/v3.txt)
  are session-EPHEMERAL — a fresh session must regenerate via Reproduction above.
