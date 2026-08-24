---
glass: ""
status: in-progress
last_worked_on: 2026-08-23
next_action: "#47 (swipeable slideshow: trackpad, touch, horizontal slide motion) pushed and closed 2026-08-23 — owner picked variant B, peek slides with the existing dots. No agent-ready ticket is queued: #45 (projects content: images, stacks, dates for the seven new entries) and #46 (redesign the /projects expanded row) are open but UNLABELLED, and #48 (should the peek center its active slide?) is a question #47 raised. #35 is the pinned map, not work. Nothing is agent-ready until it has its four template sections and the `ready-for-agent` label, so the next ticket is the owner's call; #46 and #48 both touch MediaCarousel, so answering #48 first is cheap. Two owner-side checks are still outstanding from #47, both needing a real machine: reduced motion (toggle macOS Reduce Motion THEN reload the page, the value is snapshotted at mount) and that the TechAssist YouTube player still starts on click. Also still outstanding from #34: paste the live URL into iMessage, Slack, and LinkedIn and confirm the card renders."
blocked_on: ""
phase: "Post-launch. #47 (swipeable slideshow) pushed and closed 2026-08-23: MediaCarousel's crossfade is now a horizontal track driven by trackpad wheel, drag, arrows, dots, and Left/Right keys, owner picked variant B (peek) of three previews; two defects the plan missed were fixed at gate 2 (ref-based dragConstraints collapsed to a zero-width range, and the peek shrank the single-item YouTube carousel), and the lopsided-peek question was parked as #48. godfreyponce.dev went live 2026-08-21 with no remaining blockers (decided on map #35). #34 (purpose-made 1200x630 OG share card) pushed and closed 2026-08-21, the first post-launch ticket: owner picked variant C of three previews (name in Fraunces, `DEVELOPER`, `godfreyponce.dev`, headshot filling a 440px right column), rendered by headless Chrome from the CLI at exactly 1200x630 and verified with `sips`, shipped as `/og-card.png` with both `openGraph.images` and `twitter.images` repointed; the old tags declared 1200x630 for a 1000x879 headshot. #33 (visitor analytics) closed 2026-08-20 with zero net code: the site has been proxied through Cloudflare since ~Dec 2025 and a Web Analytics site in automatic setup mode already injects the beacon at the edge on every HTML response, verified live by a real visit firing `POST /cdn-cgi/rum` 204. Both builds were reverted — the 2026-08-11 `@vercel/analytics` one because it no-ops off Vercel, the 2026-08-20 `next/script` one because it double-counted against the edge-injected beacon; #44 (pixel-art cmux chevron fronting the footer day-total line) pushed and closed 2026-08-19, owner picked variant C (blue to violet) from three previews, and the copy changed at gate 2 to `lines changed today: +N -N` with the no-push line now `godfrey no line change (yet)...`; #43 (footer reads the day total summed across ALL repos, via one GraphQL query) pushed and closed 2026-08-19, verified live at `+6133 -646` and reconciled against a per-repo breakdown; it also killed the REST events-feed lag bug; #42 (+/- stats now shown for private pushes too) pushed and closed 2026-08-19, verified against a private push to godfreyponce/lava-2 reading `+65 -9`; #41 authenticated latest-commit call (private pushes now move the footer date) fully done 2026-08-19 including deploy — `GITHUB_TOKEN` reaches Amplify's SSR runtime via the build-spec line and the live site verified against a private push; #40 latest-commit status line in the footer pushed and closed 2026-08-18, which empties the 2026-08-16 intake; #39 footer pinned under the page and uncovered at the bottom pushed and closed 2026-08-18; #38 tactile raise/press physics on links and the projects CTA pushed and closed 2026-08-17; #37 hero tagline hover color-scramble pushed and closed 2026-08-16; #31 custom 404 page pushed and closed 2026-08-14; #36 /projects grouped into README sections + seven GitHub projects pushed and closed 2026-08-13; #32 robots.ts + sitemap.ts pushed and closed 2026-08-13; #30 featured Lab stack + /projects index page pushed 2026-08-03; LossGraph ghost-runs animation 2026-07-09; scroll-driven stickman, scroll-stacking Lab cards, crossfading carousel, contribution heatmap 2026-07-07. Nothing is queued: the only open issue is the pinned map #35."
---

# personalWebsite — Project State

Personal portfolio site. Next.js 16 (App Router, Turbopack) + React 19 + Tailwind v4 +
Framer Motion. Single page (`app/page.tsx`): Hero → About → StickmanRunner → Timeline →
Education → LossGraph → The Lab → Passions → Footer. Repo: github.com/godfreyponce/portfolio (private).

*Thin snapshot. `next_action` above names the ticket that is up now — start there.
Archive: `docs/HISTORY.md`. Queue: GitHub Issues (`gh issue list`). Protocol: `AGENTS.md`.*

## Now

- Map issue #35 is pinned; regenerate `docs/decision-map.html`
  at every ticket close (command in AGENTS.md, "Question tickets").
- Pre-existing tree items (owner's, don't touch): unstaged deletion of
  agent_architecture_strategy.md, untracked Icon file, untracked `docs/plans/*`
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
- Signal project was deliberately removed 2026-07-07 (owner) — don't resurrect from git.
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
- `useReducedMotion()` reads the value once at mount and never updates (framer's own source carries
  the TODO). Toggling macOS Reduce Motion on a live page does nothing — toggle it, THEN reload.
  #47's reduced-motion path has still never been runtime-verified.
- In a hidden automation tab, Framer motion values animate but reads of `element.style.transform`
  land mid-spring and look wrong; force a frame with a screenshot before trusting one. #47 read
  -1252px for what settled at -661px (#47).
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
