# personalWebsite — Project State

Personal portfolio site. Next.js 16 (App Router, Turbopack) + React 19 + Tailwind v4 +
Framer Motion. Single page (`app/page.tsx`): Hero → About → StickmanRunner → Timeline →
Education → LossGraph → The Lab → Passions → Footer. Repo: github.com/godfreyponce/portfolio.

---

## ⏩ NEW AGENT — START HERE

*Last updated: 2026-07-09 · LossGraph divider rewritten to "ghost runs" training animation
(owner picked V1b from HTML variant previews) — committed + pushed (`b1a3f53`, `a521ace`).
Working tree clean except pre-existing items (see bottom). Previous session (2026-07-07)
shipped + pushed 6 feature commits (`45936f3..0b2bd35`): scroll-driven stickman,
scroll-stacking Lab cards, crossfading carousel, retina-sharpened images, GitHub contribution
heatmap, brand icons on tech tags, Signal card removed. Everything below was verified in the
browser + `tsc --noEmit` clean.*

**How to run (rules live in CLAUDE.md — follow them):**
```bash
pkill -f "next dev"      # ALWAYS kill existing dev servers first; only ONE at a time
npm run dev              # http://localhost:3000
npx tsc --noEmit         # run ONCE at the end of a change, not in a loop
```
No `npm run build` to verify changes; no `npm install` unless the owner asks.
Verify visually via Chrome automation at localhost:3000 (scroll the whole page).

**Owner's workflow for visual changes (established this session, owner likes it):**
propose variants as a throwaway HTML file in `public/` (works at
localhost:3000/preview-x.html AND file://), owner picks a variant, wire the winner into
the real components, DELETE the preview file. Confirm understanding before executing.

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
  the `vh * 1.3` range in the tick function.
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
  server-side in `TheLab` (async server component, `revalidate: 86400`); null on failure →
  card renders plain. Heatmap only shows on the stacked (wide) tile, not the grid fallback.
- **Tech tags** — brand-colored SVGs in `public/tech/`, mapped in `ProjectCard.tsx`
  `techIcons`. From simple-icons except: FAISS→Meta mark; **Plaid + Nebula API are
  hand-drawn stand-ins** (swap if official assets appear). Unknown tags render icon-less.
- **Images** — the 7 soft project images + Remix wordmark were Lanczos-upscaled (2–4x) +
  unsharp-masked in place (commit `ce61d11`); originals recoverable via git. They're still
  upscales — TRUE fix is re-exporting screenshots ≥1600px wide (drop-in, no code change).

## ⚠️ Gotchas that have bitten

- `overflow-x-hidden` on `<main>` silently KILLS `position: sticky` descendants (it creates
  a scroll container). It's now `overflow-x-clip` (`app/page.tsx`) — don't revert; watch for
  horizontal-overflow regressions instead.
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
lib/github.ts                         getContributions() server fetch, daily revalidate
public/tech/*.svg                     brand-colored tag icons
public/projects/**                    upscaled media (originals in git history pre-ce61d11)
```

## Backlog / open notes

- Re-export project screenshots ≥1600px wide for true retina sharpness (drop-in replacements).
- Plaid + Nebula API icons are hand-drawn stand-ins.
- Stickman traversal speed: tune `vh * 1.3` in StickmanRunner if owner wants faster/slower.
- Mobile (390px) was never live-tested this session (window resize was ignored on the scaled
  display) — fallback grid is the untouched original code path, but eyeball it sometime.
- Deploy: push to `main` on GitHub; Vercel Git integration assumed (pushed 2026-07-09 but
  deploy never confirmed live — worth checking the dashboard once).
- LossGraph reduced-motion static path + multi-run ghost accumulation were verified in a
  fast-forwarded preview, not live on the wired page (Chrome throttles automation tabs to
  ~1fps) — eyeball a full run cycle in a real browser sometime.

## Pre-existing working-tree items (NOT part of the redesign — owner's, don't touch)

`M package.json` / `M package-lock.json`, `D agent_architecture_strategy.md`,
untracked `CLAUDE.md` (project instructions, should probably be committed) and `Icon` file.
