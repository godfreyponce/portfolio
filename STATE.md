---
glass: ""
status: in-progress
last_worked_on: 2026-09-03
next_action: "#70 (kal: fill the row icon box with the K mark). Owner picked it 2026-09-03 at #68's accept, out of the #64 to #71 batch. Needs /plan-ticket first."
blocked_on: ""
phase: "#68 (Remix: reframe as a GDSC Sprint project) shipped and closed 2026-09-03, the third of the #64 to #71 batch. ProjectStatus gained a fifth member, \"sprint\", and Remix moved onto it: five changed lines, the union plus Remix's status and description in lib/projects.ts, plus one key in each of the two label maps (rowLabel in ProjectsIndex, statusLabel in ProjectCard). BOTH MAPS ARE as const AND INDEXED BY STATUS, so tsc refuses to compile until each has the new key, which is what makes a new status member self-enforcing instead of a thing to remember. The maps still disagree for project (\"Personal\" on the row, \"Project\" on the card, owner pick at #30); for sprint both say \"Sprint\". One deviation, and it was the plan's arithmetic, not the code: the plan expected 9 status: \"project\" entries before the edit and 8 after, but there were 8 before and 7 after. Two things worth carrying: REMIX NOW HAS THE LONGEST DESCRIPTION ON THE SITE, 253 chars against CometAdvisor's 136, so it is the new worst case for Lab card height; and THE BROWSER EXTENSION REFUSES TO RESIZE THE WINDOW to phone widths (\"bounds must be at least 50% within visible screen space\") while the site's smooth scroll swallows programmatic scrolling inside an injected iframe, so a mobile screenshot is not reachable and narrow-width checks have to be done by measurement in an iframe instead. #66 (Jira-Alerts: remove duplicate second slide) shipped and closed 2026-09-01, the second of the batch: one MediaItem removed from lib/projects.ts plus a git rm of the PNG. #67 (HackAI team photo as CometAdvisor slide 3) shipped and closed 2026-09-01, the first: one MediaItem inserted at index 2. Neither changed a component, because the carousel and the lightbox both read media in order. /projects IS A COLLAPSED ACCORDION, so nothing about a project's carousel exists in the DOM until the row is clicked open; and next/image srcs are query-string encoded, so reading them back through javascript_tool trips the cookie/query-string block unless you decodeURIComponent and split off everything from ? onward."
---

# personalWebsite — Project State

Personal portfolio site. Next.js 16 (App Router, Turbopack) + React 19 + Tailwind v4 +
Framer Motion. Single page (`app/page.tsx`): Hero → About → StickmanRunner → Timeline →
Education → LossGraph → The Lab → Passions → Footer. Repo: github.com/godfreyponce/portfolio (private).

*Thin snapshot. `next_action` above names the ticket that is up now — start there.
Archive: `docs/HISTORY.md`. Queue: GitHub Issues (`gh issue list`). Protocol: `AGENTS.md`.*

## Now

- New batch #64 to #71, opened 2026-09-01, none carrying `ready-for-agent` yet. #67, #66 and #68
  are done; `next_action` names #70, which the owner green-lit at #68's accept. #64, #65 and #69
  still need the owner's green light before anyone starts.
- Feel pass #53: every build ticket under it has landed (#55 to #60, #62, #63, #61). #53 itself
  is still open; closing it is the owner's call.
- Map issue #35 is pinned; regenerate `docs/decision-map.html`
  at every ticket close (command in AGENTS.md, "Question tickets").
- Pre-existing tree items (owner's, don't touch): unstaged deletion of
  agent_architecture_strategy.md, untracked Icon file, untracked `docs/plans/*` (plan files
  have never been tracked here), and untracked `public/godfrey_portrait.jpg` (kept as an asset).

## Run / verify (do this first)

```bash
pkill -f "next dev"      # ALWAYS kill existing dev servers first; only ONE at a time
npm run dev              # http://localhost:3000
npx tsc --noEmit         # run ONCE at the end of a change, not in a loop
```
No `npm run build` to verify changes; no `npm install` unless the owner asks.
Verify visually via Chrome automation at localhost:3000 (scroll the whole page).

## Gotchas (short form — full detail in docs/HISTORY.md)

- A running dev server serves STALE CSS after a `globals.css` `@theme` or `next/font` edit.
  In #62 `--font-display` kept resolving to the deleted `--font-fraunces`, so every serif fell
  back to Geist through hard reloads. `pkill -f "next dev"; rm -rf .next; npm run dev`. Suspect
  this BEFORE debugging the CSS.
- The Chrome extension cannot resize the page viewport here. `resize_window` returns success and
  `document.documentElement.clientWidth` does not move, and osascript bounds do not reach the
  window holding the automated tab. Narrow-width checks are owner-side until this changes.
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
  Headless buys an exact viewport, NOT motion: `requestAnimationFrame` does not fire there either,
  so anything rAF-driven is dead in it too. The streak count-up never advanced under CDP even with
  `prefers-reduced-motion: no-preference` emulated and a real `mouseMoved` on the handler's element
  (#57). Hand-rolled rAF counters, like Framer springs, are owner-side checks.
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
