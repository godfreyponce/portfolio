# personalWebsite — Build History & Reference

*Archived from STATE.md on 2026-07-13. STATE.md is now a thin quick-resume snapshot; this file holds the full build archive and per-feature detail. The work queue lives in GitHub Issues.*

## Session changelog

*2026-07-09 · LossGraph divider rewritten to "ghost runs" training animation
(owner picked V1b from HTML variant previews) — committed + pushed (`b1a3f53`, `a521ace`).
Previous session (2026-07-07) shipped + pushed 6 feature commits (`45936f3..0b2bd35`):
scroll-driven stickman, scroll-stacking Lab cards, crossfading carousel, retina-sharpened
images, GitHub contribution heatmap, brand icons on tech tags, Signal card removed.
Everything below was verified in the browser + `tsc --noEmit` clean.*

### 2026-07-15 — Retina project screenshots (partial, #1)

- **#1 re-export (partial):** owner supplied native high-res exports; wired the clean
  upgrades and dropped the ones that would regress. Comet (logo/screenshot 1612w→~2700w,
  stack 1218w→1762w) and Nudge (screenshot 1612w→2732w, stack 1400w→2622w, logo
  1484w→1584w) swapped in. Several changed format (jpg→png/jpeg), so the `lib/projects.ts`
  media refs were updated to match filenames. Remix Godfrey re-exported (1400w→2732w) and
  re-encoded PNG→JPG (8.9M→1.1M, `sips` q85) to keep the repo asset sane. Remix stack + logo
  NEW exports were *lower* resolution than the live files (776w/960w vs 1280w), so they were
  left as-is and #1 stays open for genuine re-exports of those two. Verified: new paths serve
  200, old 404, page compiles, `tsc --noEmit` clean. Browser visual check deferred to owner
  (Chrome extension disconnected this session).

### 2026-07-15 — Stickman traversal speed tuned

- **#3 traversal speed:** the scroll buddy's crossing was spread over more scroll for a
  more relaxed stroll — the `vh` divisor in the tick function's progress ratio went from
  `1.3` to `1.7` (larger = slower). Owner picked `1.7` by feel from live `?stick=<K>`
  candidates (1.0 / 1.3 / 1.7) on the real page; the temporary query-param scaffold was
  removed after selection. One-line change in `components/StickmanRunner.tsx`;
  `tsc --noEmit` clean, reduced-motion static-pose path untouched.

### 2026-07-14 — Lab runtime warning cleanup

- **#8 Framer Motion scroll measurement:** the installed Framer Motion version measures a
  target against `document.scrollingElement`, so positioning the ProjectStack target alone
  does not satisfy its development check. The root `<html>` element now carries Tailwind's
  `relative` utility. Clean 390x844 and 1280x900 runs emitted no warning; the five desktop
  cards retained sticky positioning, scale transforms, and their full stacking sequence.
- **#9 project-logo sizing:** project header logos now use an explicit 40x40 box with
  `object-contain`. This overrides automatic image height sizing without distorting the
  non-square CometAdvisor, Remix, and TechAssist assets. All four headers retained their
  mobile and desktop layouts with zero Next image warnings or horizontal overflow.
- Full mobile-page and desktop-stack browser sweeps passed with no warnings or errors;
  `tsc --noEmit` passed.

### 2026-07-13 — Accepted QA, compact mobile headers, and metadata

- **#4 mobile QA:** accepted after a full 390px browser pass found no page-level horizontal
  overflow and confirmed the carousel and in-flow project expander. The CometAdvisor
  title/status collision discovered during that pass was split into #7.
- **#5 production pipeline QA:** accepted after confirming the latest pushed functional
  revision was live through the repository's AWS Amplify push webhook. The unrelated
  `.com` Open Graph fallback discovered in production remains tracked separately as #10.
- **#7 mobile header fix:** the owner selected the compact single-row variant. Below 640px,
  the project logo, flexible title, and compact status badge now share one row; the grouped
  desktop header is unchanged. Verified across all four project cards at 390×844 with no
  overlap, clipping, or horizontal overflow, then checked again at 1280px; `tsc --noEmit`
  passed. The three-option throwaway preview was deleted after selection.
- **#6 LossGraph QA:** normal runs, four-ghost accumulation, offscreen pause/resume, and
  resize reset all passed live. The exact reduced-motion branch was then forced temporarily
  for browser coverage: three faint ghosts plus the converged curve rendered with a stable
  `run 4 · loss` readout, and both the screenshot bytes and readout were unchanged after
  3.2s. The force was reverted and normal animation resumed. Limitation accepted by the
  owner: the in-app browser does not inherit the host macOS reduced-motion preference.
- **#10 metadata fix:** `app/layout.tsx` now uses `https://godfreyponce.dev` as the canonical
  site URL directly, eliminating the stale `.com` fallback and environment ambiguity.
  Browser verification confirmed the Open Graph URL and image resolve under `.dev`;
  `tsc --noEmit` passed.
- **#11 footer social-link accessibility:** icon-only GitHub, LinkedIn, and email links now
  expose explicit accessible names through `SocialLink` without changing their appearance.
  Browser accessibility snapshots confirmed all three names at 390x844 and 1280x900; both
  layouts retained zero horizontal overflow and `tsc --noEmit` passed.
- **#12 Bio copy:** the owner selected the direct-and-familiar option from a three-variant
  throwaway HTML preview. The Bio now identifies Godfrey as a junior Computer Science major
  with a minor in Cognitive Science, and the soccer paragraph matches the selected voice.
  The UTD tooltip and soccer scroll interaction remain intact; the preview was deleted after
  selection. Mobile/desktop browser checks and `tsc --noEmit` passed.

## What's on the page (current behavior)

- **LossGraph** (`components/canvas/LossGraph.tsx`) — "ghost runs" training divider
  (Education → The Lab): the loss curve draws itself (~7s ≙ 50k fake steps), mono ticker
  top-right (`run N · step · loss · best`, ★ on a new best); converged runs stay behind as
  faint ghosts (max 4), each run gets a new seed. Mouse-pluck springs kept (now scoped to
  the band, not window). dpr-scaled canvas; IntersectionObserver pauses offscreen;
  `useReducedMotion` → static ghosts+curve, no loop. Ghosts/best reset on resize (widths
  no longer line up). Readout uses `text-accent` via innerHTML — fine because the component
  never re-renders.
- **StickmanRunner** (`components/StickmanRunner.tsx`) — "scroll buddy": his x-position
  mirrors scroll through the band (runs right scrolling down, moonwalks back up, breathes/
  blinks when idle). Ref-driven SVG via rAF (no per-frame React state); IntersectionObserver
  starts/stops the loop; `useReducedMotion` → static waving pose. Traversal feel is tuned by
  the `vh * 1.7` range in the tick function.
- **The Lab** (`TheLab.tsx` → `ProjectStack.tsx` → `ProjectCard.tsx` variant="stack") —
  scroll-stacking glass cards: each card `md:sticky` (440px tall, stack max-w 900px,
  `top: 7vh + i*12px` cascade), scale + cream-veil scrub via framer-motion
  `useScroll`/`useTransform` (NO GSAP — never add it, framer does the job). DOM order =
  paint order, no z-index games. Light glass: `bg-white/85 backdrop-blur-md ring-white/60`.
  Mobile / reduced-motion / SSR render the ORIGINAL 2-col grid fallback (`stacked` gate =
  matchMedia md && !reducedMotion).
- **"View project" expander**: grid variant expands in-flow (as always); stack variant opens
  UPWARD as an absolute overlay (in-flow would clip inside the fixed 440px card).
- **MediaCarousel** (`components/ui/MediaCarousel.tsx`) — ALL image slides stay mounted
  (that's the preload; zero blank frames), active one crossfades in 350ms `[0.2,0.8,0.2,1]`.
  `quality={90}` (requires `images.qualities` in `next.config.ts` — Next 16 rejects
  non-default values otherwise). `fit: "contain"` items (all three *-stack diagrams) render
  object-contain over a blurred cover copy of themselves.
- **GitHub finale card** — real contribution heatmap (classic green, per-day tooltips).
  `lib/github.ts` fetches `github-contributions-api.jogruber.de/v4/godfreyponce?y=last`
  server-side in `TheLab` (async server component, `revalidate: 21600` = 6h); null on failure →
  card renders plain. Heatmap only shows on the stacked (wide) tile, not the grid fallback.
- **Tech tags** — brand-colored SVGs in `public/tech/`, mapped in `ProjectCard.tsx`
  `techIcons`. From simple-icons except: FAISS→Meta mark; **Plaid + Nebula API are
  hand-drawn stand-ins** (swap if official assets appear). Unknown tags render icon-less.
- **Images** — the 7 soft project images + Remix wordmark were Lanczos-upscaled (2–4x) +
  unsharp-masked in place (commit `ce61d11`); originals recoverable via git. They're still
  upscales — TRUE fix is re-exporting screenshots ≥1600px wide (drop-in, no code change).

## ⚠️ Gotchas that have bitten (full detail)

- `overflow-x-hidden` on `<main>` silently KILLS `position: sticky` descendants (it creates
  a scroll container). It's now `overflow-x-clip` (`app/page.tsx`) — don't revert; watch for
  horizontal-overflow regressions instead.
- Framer Motion's target-based `useScroll` checks the page scroller's positioning. Keep the
  `relative` utility on the root `<html>` element in `app/layout.tsx`; it does not create a
  scroll container, while removing it restores the development warning.
- Next 16 statically prerenders + needs `images.qualities` config for non-75 qualities.
- Browser-automation tab gets frozen/throttled when backgrounded — long JS with awaits times
  out (CDP 45s); use fire-and-collect (write to `window.__x`, read in a 2nd call) and
  screenshots to force frames.
- projects data lives in `lib/projects.ts` (typed `Project`, `MediaItem` with optional
  `fit`); Signal was deliberately REMOVED 2026-07-07 (owner) — don't resurrect from git.
- git (any external binary, really) can suddenly die with `fatal: Unable to read current
  working directory: Operation not permitted` in this repo — that's macOS revoking the
  terminal's **Desktop folder** access (TCC), NOT a git/repo problem. File tools keep
  working, which makes it confusing. Fix: owner re-allows in System Settings → Privacy &
  Security → Files and Folders (or clicks the Allow dialog), then retry. Happened
  2026-07-09 mid-session. Also: the harness may reset the shell cwd between calls — prefix
  git commands with `cd /Users/geovponce/Desktop/personalWebsite;` if paths act weird.

## File map (the parts that matter)

```
app/page.tsx                          section order; overflow-x-clip lives here
components/StickmanRunner.tsx         scroll-buddy stickman (self-contained)
components/canvas/LossGraph.tsx       ghost-runs training divider (self-contained)
components/sections/TheLab.tsx        async server component; fetches contributions
components/sections/ProjectStack.tsx  sticky stack + StackedCard math + GitHubTile + Heatmap
components/sections/ProjectCard.tsx   grid|stack variants; techIcons map; upward expander
components/ui/MediaCarousel.tsx       all-mounted crossfade carousel; fit:"contain" backdrop
lib/projects.ts                       project data (4 projects)
lib/github.ts                         getContributions() server fetch, 6h revalidate
public/tech/*.svg                     brand-colored tag icons
public/projects/**                    upscaled media (originals in git history pre-ce61d11)
```
