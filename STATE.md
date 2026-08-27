---
glass: ""
status: in-progress
last_worked_on: 2026-08-26
next_action: "#56 (cards: 4px radius, no shadow, no border, equal Passions heights), second build ticket of the #53 feel pass. NOT ready-for-agent yet: confirm with the owner first."
blocked_on: ""
phase: "#55 (prefactor: one 960px content column and one section rhythm) shipped and closed 2026-08-26, the first BUILD ticket of the #53 feel pass. `Section` is now the only wrapper a home section uses: no more `width` prop, no narrow / wide split, hard-coded `w-full max-w-[960px] mx-auto px-6 py-24`, and later tickets in the pass edit that one class string instead of six files. Hero and Passions stopped hand-rolling their own `<section>`; About returns a fragment so its 1px rule stays full bleed; Timeline, Education and The Lab stopped passing padding and width. 14 lines across 7 files, layout only. The one interpretation call, accepted by the owner at gate 2 against a 48px alternative: the 96px rhythm is PADDING (96/96 on every section, box gaps 0), not a gap between boxes, because the audit measured section boxes and padded boxes that stack touch. The three full-bleed interstitials (the rule, StickmanRunner 140px, LossGraph 288px) are not sections and did not move. `ProjectStack` has zero diff and the deck still renders 900x440 inside the new 912px content box, which leaves The Lab heading 6px left of the deck edge (was 102px) - accepted, and a one-class fix in `ProjectStack.tsx` if it ever matters. #54 (comparison page: site vs cmrg vs genesiating) shipped, pushed, and closed 2026-08-26, the first deliverable of the #53 feel pass. `public/feel-compare.html` plus nine PNGs under `public/feel-compare/`: hero, one mid-page section and one card from godfreyponce.dev, cmrg.me and genesiating.com, shot in headless Chrome over the DevTools protocol at a 1440x757 viewport (cards clipped at 2x), laid over the #53 audit table with the site's outlier cells shaded. Nothing in the real components changed. Three things worth carrying: the plan's prose said 10 shaded cells while its own markup and its own stated rule give 11 (only small label size and distinct text colours put the site inside the reference range, so 11 is what shipped); cmrg.me must be fetched as `www.cmrg.me` because the apex times out from this machine; and the page is a THROWAWAY, deleted together with its folder in the docs commit that closes the last ticket of the pass. #53 (feel pass: cmrg weight, genesiating imagery, no structure change) was opened and sliced the same day into #55 to #60; none of them carries ready-for-agent yet. #51 (two-finger swipe and touch drag paging in the /projects overlay) shipped, pushed, and closed 2026-08-26. The overlay's dialog root is a `motion.div` with `touch-none`, `onPanStart`/`onPanEnd`, and a native non-passive `wheel` listener; the thresholds are the carousel's own constants, now exported (four `export` keywords, the whole carousel diff). The pan flips on release and never follows the finger, a `panned` ref keeps a swipe released over the scrim from reading as a scrim click, and a vertical wheel or pan is left to the page. Verification took three sessions because the automation tab was never the active tab of its Chrome window (see gotchas). #52 (overlay opens instantly) shipped, pushed, and closed 2026-08-25. The /projects overlay's image stage is now two layers: the bottom one repeats the carousel's exact request (`CAROUSEL_SIZES`, imported so the two surfaces cannot drift) so it paints off cache, the top one is the 1100px render held at opacity 0 until `onLoad`, then faded in over 0.15s in the same `fill object-contain` box, so the sharpen shifts nothing. A rolling window of one slide either side is preloaded with real invisible eager `<img>` elements, skipping YouTube items. The whole `MediaCarousel` diff is one `export` keyword. Two things the plan got wrong and the build did not paper over: in dev the cached layer DOES issue one request (a 300-byte revalidation, no image body, because dev sends `max-age=0, must-revalidate`; production sends `max-age=14400` and issues none), and the bottom layer still carries `next/image`'s default `loading="lazy"` because the plan only set `eager` on the preloads. The throttled first-frame check is still owner-side; automation has no network throttle. Post-launch. #50 (two em dashes left in shipped project descriptions) shipped, pushed, and closed 2026-08-25 and emptied the queue - 49 tickets, 49 decided, 0 frontier. Two `description` lines in `lib/projects.ts`, reworded by the owner at the gate, not by the build. #45 (projects content: images, stacks, dates) shipped, pushed, and closed 2026-08-25, which empties the projects-redesign arc that #46, #47, #48 and #49 opened: four rows now carry a real carousel, all seven non-hackathon entries carry a stack and a date, and the homepage TechAssist card became a carousel as a knock-on of putting the video slide inside `media`. #50 was opened from the same build for the two em dashes still in the CometAdvisor and Remix `description` strings. #49 (click a screenshot for a bigger slideshow overlay) shipped, pushed, and closed 2026-08-25: owner picked variant B (\"Gallery card\") of three previews, so an image slide in the expanded /projects row is now a button that opens MediaLightbox, a panel-on-scrim overlay that pages with arrows, keys, and the scrim, traps Tab, locks page scroll, and hands the row back on whatever slide it was left on with focus on that slide. YouTube slides stay unclickable by design (clicks over an embed belong to the player) but paging still reaches them as a bigger embed. #46 (expanded /projects row redesigned, stack chips react to hover) shipped, pushed, and closed 2026-08-24: owner picked variant A of three previews, so the opened row is now a two-column split (media 55% left, description + \"Built with\" chips + links right) instead of a full-width 3:2 carousel with blocks stacked under it, and the chips answer hover and keyboard focus with an accent border, ink text, a 2px lift, and the icon at full opacity, every transform behind motion-safe:. The plan missed one empty-state guard, caught at gate 2: variant A adds a standalone \"Built with\" label and seven projects carry tags: [], so clawd showed a heading over nothing. #49 (click an image for a bigger slideshow overlay) was opened from the same gate. #48 (peek: centre it or not?) answered, pushed, and closed 2026-08-24 with both of its options discarded: the peek came out of MediaCarousel entirely and slides fill the frame again. #47's variant preview and #48's own measurements were both taken on /projects (838px box), but the homepage Lab card puts the carousel in a md:w-1/2 column at 494px, where the peek reads as an ~82px slab of clipped screenshot with the arrow floating on it. Two class changes, everything #47 added kept. #47 (swipeable slideshow) pushed and closed 2026-08-23: MediaCarousel's crossfade is now a horizontal track driven by trackpad wheel, drag, arrows, dots, and Left/Right keys, owner picked variant B (peek) of three previews; two defects the plan missed were fixed at gate 2 (ref-based dragConstraints collapsed to a zero-width range, and the peek shrank the single-item YouTube carousel), and the lopsided-peek question was parked as #48. godfreyponce.dev went live 2026-08-21 with no remaining blockers (decided on map #35). #34 (purpose-made 1200x630 OG share card) pushed and closed 2026-08-21, the first post-launch ticket: owner picked variant C of three previews (name in Fraunces, `DEVELOPER`, `godfreyponce.dev`, headshot filling a 440px right column), rendered by headless Chrome from the CLI at exactly 1200x630 and verified with `sips`, shipped as `/og-card.png` with both `openGraph.images` and `twitter.images` repointed; the old tags declared 1200x630 for a 1000x879 headshot. #33 (visitor analytics) closed 2026-08-20 with zero net code: the site has been proxied through Cloudflare since ~Dec 2025 and a Web Analytics site in automatic setup mode already injects the beacon at the edge on every HTML response, verified live by a real visit firing `POST /cdn-cgi/rum` 204. Both builds were reverted — the 2026-08-11 `@vercel/analytics` one because it no-ops off Vercel, the 2026-08-20 `next/script` one because it double-counted against the edge-injected beacon; #44 (pixel-art cmux chevron fronting the footer day-total line) pushed and closed 2026-08-19, owner picked variant C (blue to violet) from three previews, and the copy changed at gate 2 to `lines changed today: +N -N` with the no-push line now `godfrey no line change (yet)...`; #43 (footer reads the day total summed across ALL repos, via one GraphQL query) pushed and closed 2026-08-19, verified live at `+6133 -646` and reconciled against a per-repo breakdown; it also killed the REST events-feed lag bug; #42 (+/- stats now shown for private pushes too) pushed and closed 2026-08-19, verified against a private push to godfreyponce/lava-2 reading `+65 -9`; #41 authenticated latest-commit call (private pushes now move the footer date) fully done 2026-08-19 including deploy — `GITHUB_TOKEN` reaches Amplify's SSR runtime via the build-spec line and the live site verified against a private push; #40 latest-commit status line in the footer pushed and closed 2026-08-18, which empties the 2026-08-16 intake; #39 footer pinned under the page and uncovered at the bottom pushed and closed 2026-08-18; #38 tactile raise/press physics on links and the projects CTA pushed and closed 2026-08-17; #37 hero tagline hover color-scramble pushed and closed 2026-08-16; #31 custom 404 page pushed and closed 2026-08-14; #36 /projects grouped into README sections + seven GitHub projects pushed and closed 2026-08-13; #32 robots.ts + sitemap.ts pushed and closed 2026-08-13; #30 featured Lab stack + /projects index page pushed 2026-08-03; LossGraph ghost-runs animation 2026-07-09; scroll-driven stickman, scroll-stacking Lab cards, crossfading carousel, contribution heatmap 2026-07-07. The queue is empty: every work ticket is closed and #35, the pinned map, is the only open issue."
---

# personalWebsite — Project State

Personal portfolio site. Next.js 16 (App Router, Turbopack) + React 19 + Tailwind v4 +
Framer Motion. Single page (`app/page.tsx`): Hero → About → StickmanRunner → Timeline →
Education → LossGraph → The Lab → Passions → Footer. Repo: github.com/godfreyponce/portfolio (private).

*Thin snapshot. `next_action` above names the ticket that is up now — start there.
Archive: `docs/HISTORY.md`. Queue: GitHub Issues (`gh issue list`). Protocol: `AGENTS.md`.*

## Now

- Feel pass #53 is open. #55 (the prefactor) landed; #56 to #60 remain, none
  ready-for-agent yet. `public/feel-compare.html` and `public/feel-compare/` are that
  pass's throwaway reference: DELETE both in the docs commit that closes its last ticket.
- Every home section now renders through `Section`, whose one class string
  (`max-w-[960px] px-6 py-24`) is what the rest of the pass edits. It takes no `width`.
- Map issue #35 is pinned; regenerate `docs/decision-map.html`
  at every ticket close (command in AGENTS.md, "Question tickets").
- Pre-existing tree items (owner's, don't touch): unstaged deletion of
  agent_architecture_strategy.md, untracked Icon file, and untracked `docs/plans/*`
  (plan files have never been tracked here; leave them out of commits).

## Run / verify (do this first)

```bash
pkill -f "next dev"      # ALWAYS kill existing dev servers first; only ONE at a time
npm run dev              # http://localhost:3000
npx tsc --noEmit         # run ONCE at the end of a change, not in a loop
```
No `npm run build` to verify changes; no `npm install` unless the owner asks.
Verify visually via Chrome automation at localhost:3000 (scroll the whole page).

## Gotchas (short form — full detail in docs/HISTORY.md)

- `overflow-x-hidden` on `<main>` kills `position: sticky` — it's `overflow-x-clip` now, don't revert.
  Doubly load-bearing since #39: the footer is `sticky bottom-0 z-0` and only reveals because
  `<main>` is not a scroll container. `app/page.tsx` wraps everything except `<Footer />` in an
  opaque `z-10 bg-surface` lid — keep it opaque and keep the footer outside it, or the footer
  shows through mid-page.
- Next 16 needs `images.qualities` in `next.config.ts` for non-75 image qualities.
- A `_next/image` line in the DEV network panel is NOT proof of a cache miss. Dev sends
  `Cache-Control: public, max-age=0, must-revalidate`, so Chrome revalidates every cached image:
  ~300 bytes of headers, no image body. Check `transferSize` in Resource Timing, not the request
  list. Production sends `max-age=14400` and issues no request at all (#52).
- Signal project was deliberately removed 2026-07-07 (owner) — don't resurrect from git.
- The extension tab can also render in an OFFSCREEN surface at a fixed 1872x862 viewport that
  ignores `resize_window` entirely, with `visibilityState: "hidden"` and `outerWidth: 0`. The
  `osascript` active-tab fix below does NOT clear this one (#55). When a measurement needs an exact
  viewport, skip the extension and drive headless Chrome over CDP the way #54 and #55 did:
  `--headless=new --remote-debugging-port=9222`, then `Emulation.setDeviceMetricsOverride` and
  `Runtime.evaluate`. Kill it after (`pkill -f 'remote-debugging-port=9222'`).
- **The automation tab must be the ACTIVE tab of its Chrome window** (#51). `visibilityState`
  reads `hidden` and zero animation frames run when the extension's tab sits behind another tab,
  and raising the window, signing in, or making a fresh tab group does not fix it. Symptoms:
  `outerWidth`/`outerHeight` read 0, drags arrive as plain clicks, `AnimatePresence` crossfades
  never finish so the incoming slide never mounts (counter says `4 / 4`, no iframe). Fix from the
  terminal: `osascript -e 'tell application "Google Chrome" to set active tab index of window 1
  to N'` (list tabs with `title of every tab of window 1`). Gate every animated check on
  `document.visibilityState === "visible"` and one `requestAnimationFrame` actually firing.
- Framer Motion needs animation frames, so NOTHING it drives works in a backgrounded automation tab:
  drag detection never starts (a test drag arrives as a plain click), and `animate()` springs freeze
  mid-flight, leaving the carousel track's transform disagreeing with `current`. That reads as a
  desync bug and is not one — the pre-existing dots do it too. A screenshot forces one frame and the
  spring lands. Anything drag- or spring-shaped is an owner-side check (#49).
- Backgrounded browser-automation tabs get throttled — fire-and-collect JS + screenshots.
  `setTimeout` also clamps to ~1s there, so sampling a CSS animation on a short interval aliases
  and reads as frozen; use `document.getAnimations()` and set `currentTime` instead. `await`ing a
  `requestAnimationFrame` there never resolves and hangs the whole call for 45s (#38).
- Scripted scrolling needs `scrollTo({top, behavior: 'instant'})` — `globals.css` sets
  `html { scroll-behavior: smooth }`, so a plain `scrollTo(0, y)` animates and any measurement
  taken right after reads the OLD position. Cost 20 wasted samples that all looked identical (#39).
- In a hidden automation tab, IntersectionObserver callbacks only deliver when a frame is forced
  (a screenshot does it). Reading state immediately after a scroll shows the stale value, which
  reads as "the observer is broken" (#39).
- The automation `navigate` tool refuses `file://` URLs, so the preview-file "works from file too"
  check can't be run through it. Headless Chrome from the CLI does load `file://` and can screenshot
  it (#34), which is both the check and the way to render an exact-size image: relative paths inside
  `public/` resolve fine under `file://`. Full recipe in `docs/HISTORY.md`.
- Automation click/hover coordinates are NOT DOM pixels — the screenshot space is scaled, and the
  factor depends on window size, so MEASURE it, don't reuse a past number (#38: 1512x809 vs
  1464x783, ~0.968; #39: 1568-wide screenshot vs 1872 viewport, ~0.838). Clicking at raw
  `getBoundingClientRect` coords silently misses anything under ~30px tall while still hitting big
  buttons, which looks like a broken effect. Multiply DOM coords by ~1.033, or measure the factor
  by reading `event.clientX/Y` in a listener after one probe click.
- `getComputedStyle` is an unreliable witness under automation: in a `mousedown` handler it returns
  the transition's t=0 value, not the `:active` target (zero `transitionDuration` first — and make
  sure no earlier listener already forced the recalc), and during hover it can return stale values
  even when `matches(':hover')` is true. `getBoundingClientRect` forces layout and stays honest — a
  1px lift reads as 336.50 vs 337.50 against unhovered siblings (#38).
- Synthetic `mouseenter`/`mouseover` does NOT fire React's `onMouseEnter` (root delegation) —
  verify hover effects with a real cursor (`computer` → `hover`). And never assign `innerHTML`
  inside a React subtree to probe it: the recreated nodes fall out of the fiber tree and lose
  their handlers until reload. Both faked a broken effect on #37.
- Framer `dragConstraints={someRef}` measures `getBoundingClientRect()`, so a *block-level* flex
  track whose `shrink-0` slides overflow it has a box equal to the viewport and the computed range
  collapses to `min === max` — the track is pinned and only rubber-bands. `scrollWidth` is not
  consulted. Constrain numerically from the measured step instead. It fails quietly: `info.offset.x`
  still reports the true pointer distance, so slides still change on release (#47).
- `MediaCarousel` has two callers at very different widths: the homepage Lab card gives it a
  `md:w-1/2` column (494px measured) and the `/projects` expanded row gives it 838px. Any
  percentage-based geometry that looks right in one is not right in the other, and a variant
  preview that renders a single width will not show it: #47's 88% peek was picked on the wide
  surface and read as a slab of clipped screenshot on the narrow one, which is what removed it
  again in #48. Preview shared components at BOTH call-site widths.
- `useReducedMotion()` reads the value once at mount and never updates (framer's own source carries
  the TODO). Toggling macOS Reduce Motion on a live page does nothing — toggle it, THEN reload.
  #47's reduced-motion path has still never been runtime-verified.
- In a hidden automation tab, Framer motion values animate but reads of `element.style.transform`
  land mid-spring and look wrong; force a frame with a screenshot before trusting one. #47 read
  -1252px for what settled at -661px (#47).
- Tailwind v4 puts translate utilities on the **`translate`** property, not `transform`, so a
  `-translate-y-0.5` lift reads as `transform: none` in `getComputedStyle` and looks like it never
  applied — read `translate` instead (#46). Relatedly, `motion-safe:hover:` compiles to a real
  nested `@media (prefers-reduced-motion: no-preference) { @media (hover: hover) { ... } }`, which
  means the reduced-motion path can be proven by fetching the served stylesheet and reading the
  nesting, without emulating the OS setting the extension cannot toggle.
- `resize_window` refuses bounds on a fullscreen Chrome window — check narrow widths by injecting
  a same-origin iframe (it gets its own viewport for `vw` and media queries).
- Hosting is AWS Amplify, not Vercel — Vercel-only features (Web Analytics, ISR knobs) silently no-op.
- **DNS is proxied through Cloudflare** (nameservers `lars/princess.ns.cloudflare.com`, Cloudflare A
  records, `server: cloudflare` + `cf-ray` on live responses), with Amplify/CloudFront as the origin.
  Not obvious from the repo, and load-bearing for anything edge-shaped.
- **Analytics is DONE and needs no code (#33).** Cloudflare Web Analytics runs in automatic setup
  mode and injects its beacon at the edge on every HTML response. Adding a beacon `<script>` in the
  app double-counts. Two tickets shipped analytics code and both were reverted — check the live page
  source before building anything here. Beware two traps that both read as "it is broken": curl gets
  NO injected beacon (Cloudflare skips non-browser UAs — send a browser UA), and the beacon POSTs
  same-origin to `/cdn-cgi/rum`, not to `cloudflareinsights.com`. Ad blockers block both URLs too.
- `/api/latest-commit` renders NOTHING without `GITHUB_TOKEN` (#43): GraphQL refuses anonymous
  queries even for public data, so tokenless returns `{"today":null,"date":null}` and the footer
  line is an empty span. A fresh clone with no `.env.local` is NOT broken, that IS the fallback —
  check the env var before debugging an "empty" footer. Suppress the token for one run with
  `GITHUB_TOKEN="" npm run dev` (dotenv will not overwrite an already-set key, and empty is
  falsy) rather than editing `.env.local`.
- Do NOT go back to the GitHub REST events feed for this route (#43 removed it). Two reasons,
  both measured 2026-08-19: it lags by hours (at 21:00Z it still showed a 16:12Z push while
  `git ls-remote` had the 20:42Z commit on `origin/main`, so no TTL change fixes it), and even
  authenticated it redacts private repos' payloads down to `before`/`head`/`push_id`/`ref`/
  `repository_id`, with no commits array. GraphQL reads refs and carries `additions`/`deletions`
  per commit, which is why the route uses it.
- `/api/latest-commit`'s `date` field is fetched but never rendered (#43). It exists to tell
  "query worked, nothing pushed today" apart from "no data at all" — drop it and a tokenless
  clone would falsely render `godfrey no line change (yet)...`.
