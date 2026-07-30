# personalWebsite — Build History & Reference

*Archived from STATE.md on 2026-07-13. STATE.md is now a thin quick-resume snapshot; this file holds the full build archive and per-feature detail. The work queue lives in GitHub Issues.*

## Session changelog

*2026-07-09 · LossGraph divider rewritten to "ghost runs" training animation
(owner picked V1b from HTML variant previews) — committed + pushed (`b1a3f53`, `a521ace`).
Previous session (2026-07-07) shipped + pushed 6 feature commits (`45936f3..0b2bd35`):
scroll-driven stickman, scroll-stacking Lab cards, crossfading carousel, retina-sharpened
images, GitHub contribution heatmap, brand icons on tech tags, Signal card removed.
Everything below was verified in the browser + `tsc --noEmit` clean.*

### 2026-07-28 — Same-origin contributions proxy (#25)

- **Problem (issue #25):** since #24 the browser fetched jogruber.de directly; a visitor's
  content blocker can block that third-party domain permanently, and the once-on-mount
  fetch had no retry, so a transient API flake blanked the whole pageview.
- **Shipped fix** (commit `84922be`): new route handler `app/api/contributions/route.ts`
  proxies `github-contributions-api.jogruber.de/v4/godfreyponce` server-side, keyed by the
  same `y=all|last` param; 3 attempts with 300ms/600ms backoff; 400 on any other `y`,
  502 when all retries fail. `lib/github.ts` helpers just swapped their URLs to the
  relative `/api/contributions?y=...` (browser-only by construction) — signatures,
  parsing, and null-on-failure behavior unchanged, so `ProjectStack`, `StreakLine`,
  `Heatmap`, `computeStreaks` are all byte-identical.
- **Why `no-store`, not `s-maxage`:** freshness is the hard requirement and CloudFront
  already froze this data once (#24). Route handlers run per-request on Amplify (no
  frozen-ISR problem), and `Cache-Control: no-store` on the response is the only value
  that provably can't be over-cached by the Amplify/CloudFront stack. If the community
  API ever needs sparing, swap the header for `public, s-maxage=300` — nothing else changes.
- **Verification:** curl → 200 + `cache-control: no-store` + expected JSON for both
  `y` values, 400 for `y=bogus`; in the browser
  `performance.getEntriesByType("resource")` showed only the two same-origin
  `/api/contributions` requests and ZERO jogruber.de entries (the blocker-proofness
  proof); heatmap rendered and streak line read 23/23; `tsc --noEmit` exit 0.

### 2026-07-27 — Client-side streak + heatmap fetch (#24)

- **Root cause:** Amplify never runs ISR background revalidation, so `TheLab`'s server
  fetches (`next: { revalidate: 21600 }`) froze at deploy time — prod showed 16/16 on
  2026-07-27 while fresh data computed 21/21. Full probe trace in issue #24. Alternatives
  rejected with owner: fixing Amplify ISR (open-ended AWS debugging), `force-dynamic`
  (slows every visit, still fights CloudFront).
- **Shipped fix** (commit `16e5ab1`): `ProjectStack` owns `contributions` + `streaks` as
  state and fetches both in a `useEffect` on mount; `TheLab` is a plain non-async
  component; `lib/github.ts` helpers dropped the Next-only `revalidate` option (only
  server-specific thing in them). The jogruber API sends `access-control-allow-origin: *`
  so browser calls work. `computeStreaks`, `StreakLine`, `GitHubTile`, `Heatmap` all
  byte-identical.
- **Intentional behavior change:** the streak line no longer exists in the SSR HTML
  (`curl | grep -c "day current streak"` → 0); it appears ~200-400ms post-hydration.
  Heatmap already behaved that way (stacked branch only renders post-hydration). Both
  fetchers resolve null on failure → components render nothing, no new UI needed.
- **Live-data proof during verification:** node helper run computed 21/21; minutes later
  the browser showed 22/22 — the API had registered that day's contributions in between,
  and a node re-run agreed at 22/22. Exactly the freshness the ticket wanted.
- **⚠️ Verification gotchas:** backgrounded automation tabs throttle `setTimeout` to
  ≥1s on top of suspending rAF, so the #22 count-up can't be watched even with an
  rAF-shim — read the `shown` hook state off the StreakLine fiber instead (null until
  hover, final values after). `read_network_requests` only tracks from its first call;
  the page's own `performance.getEntriesByType('resource')` is the reliable check.
  Grid-branch check without window resize: dispatch `isMd` state to false via the
  ProjectStack fiber's hook queue, then reload the tab to discard the poke.

### 2026-07-22 — Streak hover animation: count-up on the numbers (#22)

- **Shipped variant A "count-up"** (commit `ae57c65`): hovering the streak numbers makes
  both count up from 0 to their real values over ~600ms with a cubic ease-out, driven by a
  `requestAnimationFrame` loop in `StreakLine` (`ProjectStack.tsx`). Owner picked A from 3
  variants in throwaway `public/preview-streak-hover.html` (B = bubble-weight swell,
  C = odometer digit roll; deleted after).
- **Hover target narrowed at acceptance:** first build put `onMouseEnter` on the outer
  full-width line div (`absolute inset-x-0` in the stacked branch → ~900px hover row).
  Owner feedback: trigger only on the numbers. The handler moved to an inner
  shrink-wrapped span (`flex items-baseline gap-4`, ~115px) holding the visible cluster;
  the outer div only right-aligns (`flex justify-end`). Both call sites untouched.
- **No layout shift:** each number renders in an `inline-block text-right` span with
  `minWidth` reserved in `ch` units for the final value, so mid-count digits never move
  the flame, "longest", or the right edge.
- **Guards:** `useReducedMotion()` skips the animation entirely; hooks are hoisted above
  the `if (!streaks) return null` early return (React hook-order requirement); unmount
  cleanup cancels the pending rAF; re-hover cancels and restarts cleanly. `sr-only`
  sentence + `aria-hidden` structure from #21 unchanged.
- **⚠️ Verification gotcha:** hidden automation tabs suspend rAF — the count-up can't be
  watched frame-by-frame there. Verified instead by reading the StreakLine fiber's hook
  state (shown state reaches final values, rafRef id advances) plus owner's live check.
  React `onMouseEnter` also never fires from synthetic dispatched events; call the
  element's `__reactProps` handler directly.

### 2026-07-21 — Streak line: current + longest GitHub streak under Lab card (#21)

- **Shipped variant C "editorial numerals"** (commit `be3873c`): right-aligned line just
  under the GitHub tile — current streak in Fraunces (`font-display text-[17px]
  text-ink-muted`) with a small flame, `longest N` faint beside it (`text-xs ink-faint`),
  `tabular-nums`, flame `aria-hidden` + `sr-only` sentence. Owner picked C from 3 variants
  in throwaway `public/preview-streak.html` (A = caption text line, B = badge pills;
  deleted after). First mock used a generic card and owner rejected it — the preview card
  must faithfully replicate the real tile (octocat, Fraunces heading, 9px heatmap cells).
- **Data:** new `getStreaks()` in `lib/github.ts` fetches the jogruber proxy with `?y=all`
  (all-time longest, not capped at 365 days), 6h revalidate, null on any failure → line
  renders nothing (mirrors heatmap). `getContributions()` untouched. `TheLab.tsx` fetches
  both via `Promise.all`.
- **⚠️ API gotchas (y=all):** years arrive in DESCENDING order (2026 first), and the
  current year is PADDED with future zero-count days through Dec 31. `computeStreaks()`
  filters `date <= todayISO` and string-sorts before any math or the current streak is
  always 0.
- **Streak semantics:** a zero-count TODAY is pending, not a break (skip it, walk back
  from yesterday); zero state renders `0` honestly (owner call); adjacency checked via
  `Date.parse` day-diff so a missing day breaks a run. Pure `computeStreaks(days,
  todayISO)` is exported; verified with 9 node fixture cases (Node 24 runs `.ts` directly)
  + live call matching known real values (16/16 on ship day).
- **Placement:** `StreakLine` local to `ProjectStack.tsx`. Stacked branch: second child of
  the last `StackedCard`, `absolute inset-x-0 top-full mt-3` off the `h-[440px]` sticky
  wrapper (last card keeps scale 1 / veil 0, so no overlap). Grid/SSR branch: tile wrapped
  in `flex h-full flex-col gap-3` with the line below (verified via SSR HTML — `isMd`
  starts false, so curl shows the grid branch).
- **Follow-up queued:** #22 animate the streak numbers on hover (owner request at pick).

### 2026-07-21 — Bio bubble weight: UTD + Soccer hovers (#20)

- **Shipped variant A "anchored tooltip"** (commit `9a3a1f1`): the two interactive bio
  words in `components/sections/About.tsx` reuse `.hover-bubble` from #19 verbatim — no
  new physics, zero additions to globals.css. Owner picked A from 3 variants in throwaway
  `public/preview-bio-bubble.html` (B = transform on the outer span so the tooltip rides
  along; C = hover pop without press sink on UTD; deleted after).
- **UTD restructure:** `.hover-bubble` can't sit on UTD's outer span without scaling the
  absolutely-positioned tooltip inside it. Fix: outer span keeps `group relative
  inline-block cursor-help` and anchors the tooltip; a NEW inner span carries
  `hover-bubble` + the word. Two gotchas baked into that move: (1) underline classes MUST
  move to the inner span — `text-decoration` does not propagate into `inline-block`
  children, leaving them outside renders no underline at all; (2) color hover became
  `group-hover:` so it still fires from the whole word area, matching the old behavior.
- **Transition conflict rule (same as #19):** both words DROPPED Tailwind's
  `transition-colors duration-200` — `.hover-bubble` folds color timing (150ms) into its
  own transition shorthand, and two transition declarations fight in the cascade. Net:
  bio hover color fades went 200ms → 150ms, matching the hero socials.
- **Owner-directed deviation:** Soccer's hover color is hunter green `#355e3b` (arbitrary
  values `hover:text-[#355e3b] hover:decoration-[#355e3b]`, no theme token — single use),
  requested at review; the plan had said keep accent. UTD keeps accent `#c2410c`.
- **Verified:** UTD pops with anchored, non-wobbling tooltip; underlines intact at rest;
  no paragraph reflow on hover; Soccer click still fires `highlight-soccer` + scrolls to
  `#soccer` (smooth animation doesn't play in a throttled background automation tab —
  environment, not code; handler + target confirmed via JS); `tsc --noEmit` clean.

### 2026-07-21 — Social hover weight: Kal bubble physics on hero links (#19)

- **Shipped variant A "subtle pop"** (commit `f7fbe25`): hero GITHUB/LINKEDIN/EMAIL carry
  press-and-hold bubble weight on top of #18's cursors/colors. Hover pops to `scale(1.05)`
  on the 0.3s `cubic-bezier(0.34,1.56,0.64,1)` overshoot spring; press sinks to
  `scale(0.94) translateY(1px)` on the slow 0.45s `(0.16,0.9,0.3,1)` curve; release
  springs back with overshoot. Ported from Kal `app/globals.css:1719-1735` (Kal is
  press-only; the hover pop is our adaptation).
- **Where it lives / #20 reuse:** ONE plain unlayered class `.hover-bubble` in
  `app/globals.css` — deliberately NOT `@utility`: SocialLink carries the layered
  `transition-colors` utility, and two same-specificity utilities setting transition
  longhands would race on stylesheet order; an unlayered class always beats layered
  utilities (same pattern as `.email-google`). Tailwind's 150ms color timing is folded
  into the transition shorthand so brand-color fades don't snap. Wired per-link in
  `Hero.tsx` classNames (hero-scoped; Footer also uses SocialLink and stays plain).
  #20 = add `hover-bubble` to the UTD/Soccer bio links, nothing more.
- **Verified:** computed `matrix(1.05,…)` + brand colors on hover; EMAIL letters resolve
  to Google colors WHILE the word is scaled (transform composes with the span animation);
  `/` separators shift 0px (no reflow); footer unaffected; reduced-motion guard in served
  CSS; `tsc --noEmit` clean. Owner picked A from 3 variants in throwaway
  `public/preview-bubble.html` (B scale 1.08, C 1.06 + 1px lift; deleted after).
- **Gotcha re-confirmed:** a hidden/backgrounded automation tab does not flush hover
  style recalc — synthetic hover reads stale computed styles until a frame is forced
  (take a screenshot after hovering, then read).

### 2026-07-21 — Hero social hover revamp: brand cursors + brand colors (#18)

- **Shipped variant C** (commit `2c28330`): hovering GITHUB/LINKEDIN/EMAIL in the hero swaps
  the cursor for the brand logo and takes brand text colors. Cursors are 32px SVG data URIs
  in `@utility cursor-github/-linkedin/-gmail` (globals.css): Simple Icons octocat `#181717`,
  LinkedIn mark `#0a66c2`, official multicolor Gmail M (viewBox `52 42 88 66`), hotspot 4 4,
  `pointer` fallback. Text hovers: `hover:!text-brand-github` / `hover:!text-brand-linkedin`
  (`!` needed to beat SocialLink's baked-in `hover:text-ink`, same trick as Footer's
  `hover:!text-white`). EMAIL = variant C: word flashes Gmail red at 35%, then letters
  resolve to Google colors (blue/red/yellow/blue/green) via `email-resolve-*` keyframes,
  0.55s ease-out forwards; letters are 5 spans inside the `.email-google` link,
  `aria-label="Email"` keeps it one word for screen readers.
- **Tokens added** (no-hardcoded-hex rule): `--color-brand-github/-brand-linkedin` +
  `--color-google-blue/-red/-yellow/-green` in the `@theme` block.
- **Owner picked C** from 3 variants in throwaway `public/preview-social-hover.html`
  (A snap-in colors, B 24px cursor + 40ms letter stagger, C red-flash resolve; deleted after).
- **Safari:** no SVG-cursor support — falls back to plain pointer, colors still work. If
  parity ever matters: swap data URIs for 32px PNGs in `public/cursors/`.
- **Follow-ups filed:** #19 (hover weight — port Kal's `.cell` bubble physics: 0.30s
  `cubic-bezier(0.34,1.56,0.64,1)` overshoot release + 0.45s `(0.16,0.9,0.3,1)` press-in
  sink, from Kal `app/globals.css:1719-1735`), #20 (UTD + Soccer in bio get the same feel,
  reusing #19's shared utility). Both await owner green-light.

### 2026-07-20 — Interests line updated (#17)

- Panel line changed to `Interests: soccer, 3d printing, agents` (owner request, verbatim);
  wraps at 33ch to `soccer, 3d printing,` + indented `agents` continuation. Regenerated both
  themes with the same variant A args, pushed `c0ab83b`, verified live. Geometry unchanged
  (1684×864, Stack line still the longest); portrait byte-identical.

### 2026-07-19 — Neofetch panel resized for GitHub render width (#16)

- **Shipped variant A "big type classic"** to `GodfreyPonce` main (`ad1373c`): same classic
  layout as #15 (portrait left 16px, ~527px effective), panel type bumped 16/22 → **26/34**
  with the panel text wrapped at ≤33 chars (2-space hanging indent; continuation lines render
  in the value color). Panel now reads at **~12.9px effective** at GitHub's ~838px README
  width (was 8.0px). `readme.md` untouched — its `<picture>` already points at both SVGs.
- **How:** #15's generator recreated from the ticket with `P_SIZE/T_SIZE/T_LH` as CLI args
  (advances scale linearly: braille `11.04·P/16`, panel text `9.7·T/16`), regression-pinned to
  the shipped 1668×864 geometry before any variant work. Portrait extracted from the shipped
  SVG's tspans (51×96) and diff-verified byte-identical after regeneration. Three variants
  (A big-type / B compact P=12,T=20 / C stacked hero T=18) previewed against the shipped
  render at 838px in throwaway `public/preview-16.html` (deleted); owner picked A; pushed
  files byte-matched the previewed ones. Verified live on the profile (dark, signed-out);
  light is the same generator run, checked in preview.
- **Known limit (owner accepted desktop-only):** at mobile README width (~370px) even A is
  ~6px — a static SVG can't fix that while the portrait spans 96 braille columns. A real
  mobile fix is architectural: panel as native README text (e.g. highlighted code block)
  beside a portrait-only image.

### 2026-07-17 — Profile README SHIPPED: braille portrait + neofetch panel SVG pair (#15, absorbs #13)

- **Live at github.com/godfreyponce** (`GodfreyPonce` main, commit `e0e9e4a`): `readme.md` is a
  `<picture>` with `prefers-color-scheme` sources → `dark_mode.svg` / `light_mode.svg`. The held
  fence-route commit `cb31900` was superseded (old scratch clone gone; remote replaced wholesale).
- **Owner gates:** layout pick = **classic** (portrait left, panel right) over stacked/terminal;
  light mode = **same art recolored** accepted (no polarity regen); final render approved before
  push. Panel text finalized with owner edits — header `godfreyponce@github`, rows OS / College /
  Minor / Stack (`Python TypeScript Java C++`, from a repo-language census) / Projects
  ("building things that automate my lifestyle") / Interests ("soccer AI agents"). New standing
  owner rule discovered here: **no middle dots (·), no em dashes in shipped copy.**
- **How it was built:** Variant D art extracted byte-faithfully from card 2 of the (now deleted)
  `public/preview-readme.html` (51×96, all U+2800–U+28FF); python `gen_svg.py` renders art +
  panel as SVG `<text>` with one `xml:space="preserve"` tspan per row. Plan constants were wrong
  in practice — braille advance measured **11.04px** @16px (not 8.8; Apple Braille fallback), and
  the panel column is sized from the longest panel line × 9.7px/char (plan's fixed 52-cell width
  clipped the panel). Generator preserved inline in issue #16; art + panel recoverable verbatim
  from the shipped SVGs' tspans.
- **Verified live:** dark render checked on the profile (signed-out Chrome, dark scheme);
  light checked via `curl` — 200, `image/svg+xml`, light palette in body (theme-toggle step
  skipped: browser signed out, no account setting to flip; `<picture>` media queries carry it).
  Local: both SVGs screenshot-matched the picked variant on a static server before push.
- **Follow-up:** owner flagged post-ship that the panel is too small at GitHub's ~850px README
  width (SVG natural width 1668px scales to ~50%) → **issue #16** (green-lit) with full
  continuity notes. #13 closed as absorbed; #15 auto-closed by the push. Preview files
  (`preview-readme.html`, `preview-readme-full.html`, `preview-svg/`) deleted — all were
  untracked, so no removal commit exists.
- Side observation for the owner: while the dev server ran this session, something on the
  network sent `GET /login` + `POST /api/auth/login` (404s) to localhost:3000's bound network
  address, then the process died (exit 144). No repo change involved; worth knowing the dev
  server is network-visible (Tailscale interface).

### 2026-07-17 — Profile-README braille portrait accepted: Variant D (#14, part of #13)

- **#14 iteration loop closed:** the full-framing chafa portrait for `godfreyponce/GodfreyPonce`
  went through 3 preview rounds in `public/preview-readme.html` (Vision subject-lift →
  ImageMagick → chafa → GitHub-dark HTML cards). Round 1: braille chosen as the style, face too
  small (72x90). Round 2: all-braille at bigger sizes; owner picked C (96x120 +
  `-clahe 4x4%+128+6`) but the upper-lip shadow read as a moustache (real shadow band in the
  source photo, amplified by CLAHE + inverted braille). Round 3: soft-ellipse dodge over the
  upper lip before chafa — **Variant D (45% dodge) accepted**. Full recipe: flatten-on-white →
  `-clahe 4x4%+128+6` → dodge (ellipse 360,240 80,26, `-blur 0x14`, screen-composite gray 45%)
  → `chafa --format symbols --size 96x120 -c none --symbols braille --fill braille+space
  --fg-only --invert --preprocess off` (51 rows; fill MUST include `space`, NO `-level`).
- **Ship state (owner decisions):** portrait-only readme committed LOCALLY in a scratch clone
  (`cb31900`, fence route: ```` ```text ```` block, verbatim art) — **push deliberately HELD**;
  nothing goes public until the new full-README design (issue #15, separate ticket) ships as one
  piece. #13 stays open for its neofetch-panel phase. The scratch clone is session-ephemeral —
  regenerate from the recipe above if gone; D's art also lives in card 2 of the (kept) preview
  file. Known caveat: art is dark-mode-tuned; light mode renders as a negative (light/dark SVG
  pair is the eventual fix). Verified this session: `tsc --noEmit` clean, all rounds
  screenshot-checked in Chrome incl. mouth zooms.

### 2026-07-16 — Official Plaid + Nebula tech-tag icons (#2)

- **#2 icon swap:** replaced the two hand-drawn tech-tag stand-ins with official marks,
  matching the sibling simple-icons format (single-path, brand-color fill, `role`/`title`)
  rendered by `ProjectCard.tsx` `techIcons` at 13px `unoptimized`. **Plaid** — the owner's
  raster lattice was authentic (Plaid = the tartan weave) but muddy at 13px; swapped for the
  vector silhouette from plaid.com's `safari-pinned-tab.svg`, normalized to a single
  `#1c1917`-filled path → `public/tech/plaid.svg`. **Nebula API** — the UTD Nebula app-icon
  (`utdnebula.com/apple-icon.png`, dark line-art, transparent, 180px) → `public/tech/nebula.png`;
  the owner-supplied purple-tile PNG was rejected (baked-in gradient bg, only 48px). Mapping
  repointed Plaid → `.svg`, Nebula API → `.png`; old `nebula.svg`/`plaid.svg` stand-ins removed.
  Note for next time: simple-icons no longer carries Plaid (404 on all sources). Verified: both
  serve 200, `plaid.svg` well-formed XML, owner confirmed the render on localhost.

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
  working directory: Operation not permitted` — that's macOS revoking the terminal's
  folder access (TCC), NOT a git/repo problem. File tools keep working, which makes it
  confusing. Fix: owner re-allows in System Settings → Privacy & Security → Files and
  Folders (or clicks the Allow dialog), then retry. Happened 2026-07-09 and 2026-07-17.
  Since 2026-07-18 the repo's ONLY home is `/Users/geovponce/Developer/personalWebsite` —
  the old `~/Desktop/personalWebsite` path is gone; paths in pre-2026-07-18 plan files
  still say Desktop, substitute Developer. The harness may reset the shell cwd between
  calls — prefix git commands with `cd /Users/geovponce/Developer/personalWebsite;` if
  paths act weird.

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
