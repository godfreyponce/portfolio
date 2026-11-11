---
glass: ""
status: in-progress
last_worked_on: 2026-11-10
next_action: "#80"
blocked_on: ""
phase: >-
  #78 (council-climb hero and base type) shipped and closed 2026-11-10, the first ticket of the
  council-climb ship (#78 to #82, run by an orchestrator thread, decision 33). The hero is now a
  header with the portrait, name, tagline, the folded-in bio and an email copy control; About.tsx
  and SimpleBackground.tsx are gone. It adds the base the other four tickets build on: max-w-page
  (1004px), Geist Mono as font-mono, link-dashed and cursor-soccer utilities, and an instant scroll
  under reduced motion. next_action is #80 (Lab fixes, also at gate 2); #79, #81 and #82 start
  after it, in parallel.
  #76 (LAND as the lead project card) shipped and closed 2026-11-09 as data and assets only: one new
  first entry in lib/projects.ts with a 7-item carousel, six local images and a LOGO.png in
  public/projects/land/, and two new tag marks (Nemotron uses the NVIDIA mark, Raspberry Pi its own).
  Featured count is now 5, so with reduced motion at desktop width the GitHub tile sits alone in the
  last Lab row, accepted. No other ticket is ready-for-agent, so next_action names none. #77 (the
  full check's pkill stops other worktrees' dev servers) was filed during the build and is not
  green-lit.
  #75 (STATE.md head is not valid YAML) fixed and closed 2026-09-14, EMPTYING THE WORK QUEUE AGAIN:
  only #53 and #35 stay open, so next_action is blank. THE HEAD HAD NEVER PARSED: phase was one
  double-quoted line holding raw inner quotes from the #64 entry, so js-yaml, gray-matter (the parser
  glass uses) and Ruby Psych all failed on the whole head. PHASE IS NOW A >- FOLDED BLOCK SCALAR: the
  same text on two-space-indented lines, which a parser joins back into one line with single spaces,
  so quotes inside it need no escaping; the 20 old backslash-quote escapes became plain quotes. All
  three parsers read the fixed head and agreed on 15040 characters, and state-lint stayed clean. NEW
  ENTRIES GO IN AS INDENTED LINES AT THE TOP OF THE BLOCK, NEVER AS A QUOTED LINE. The Done when
  clause about glass rendering the card could not be checked, because glass reads a per-project
  glass.md today and STATE.md-head sync is its unbuilt Stage 2, so a gray-matter parse of the head
  stood in for it. A strict-YAML guard for state-lint is filed as godfreyponce/dev-meta#2.
  #74 (The Lab: TryHackMe icon in the streak row) shipped and closed 2026-09-14, EMPTYING THE WORK
  QUEUE AGAIN: only #53 and #35 stay open, so next_action is blank. THE TICKET CHANGED SHAPE TWICE
  BEFORE IT WAS BUILT: intake put a live rank in the hero social row, the owner rejected the hero
  placement at the first preview gate (2026-09-12), then moved it under the GitHub tile (2026-09-13),
  and the live number was dropped (2026-09-14) because TryHackMe sits behind a Vercel JavaScript
  challenge that answers 429 to every server-side fetch and sends no CORS header to a browser one;
  passing that challenge is bot-detection evasion and out of scope. So there is NO API ROUTE AND NO
  FETCH, only an icon and a link. THE OWNER PICKED VARIANT B of three hovers (a dark
  bg-surface-inverse square fills in, the mark turns white) AND THE FULL SIMPLE ICONS MARK, cloud plus
  binary digits, over the plan's cloud-only crop; at 22px the digits blur, and the owner saw that in
  the preview. StreakLine is now the two-end row (TryHackMeLink left, StreakNumbers right) and
  StreakNumbers keeps the return null, so the link survives a failed GitHub fetch and is in the SSR
  HTML while the numbers are not. The plan's brand color token was NOT added because variant B does
  not use it, so globals.css did not change and the branch had one commit, fast-forwarded. Side
  effect: in the grid layout the row now always takes 24px under the tile. #73 (Lab overlay: page
  through the card's images with arrow keys, click zones and swipe) shipped and closed 2026-09-08,
  EMPTYING THE WORK QUEUE AGAIN: only #53 (feel pass, the owner's to close) and #35 (the pinned map)
  stay open, so next_action is blank until a ticket is filed and green-lit. NO PREVIEW ROUND and no
  deviations from the plan, because the look was already picked at #64. SingleLightbox now takes the
  FULL items list plus startIndex and reports back through onClose(index), the same contract
  MediaLightbox already had, so the carousel's "single" branch became a copy of its "slideshow" branch
  (snap the track, return focus) and MediaLightbox.tsx did not change at all. EVERYTHING NEW IS GATED
  ON `multiple` (more than one enlargeable item, where enlargeable mirrors the carousel's render
  branch: not a YouTube slide with a videoId, and it has a src), so a one-image card renders and
  behaves exactly as #64 shipped it; NO LAB CARD HAS ONE IMAGE TODAY, so that path was proven from the
  gate in the code, not by clicking, and lib/projects.ts was deliberately not edited to manufacture a
  fixture. THE CROSSFADE IS AN AnimatePresence IN DEFAULT SYNC MODE keyed by index, not mode="wait":
  both layers are absolute inset-0, so the outgoing fades out under the incoming, and the incoming
  layer's bottom ImageStage image is the carousel's cached request, which is what paints on the first
  frame. 200ms, matching the card's entrance. THE TRACKPAD PAGES TOO, a decision the plan flagged at
  gate 1: the ticket named only keys, click zones and touch, but a non-passive wheel listener with
  preventDefault is the only thing that stops Chrome's back/forward swipe, and swallowing a consumed
  gesture silently would read as broken; same accumulate / fire-once / lock-until-quiet constants as
  the carousel and MediaLightbox. Click zones are the halves of the STAGE BOX, so a letterbox gutter
  pages too, and the picture is the only surface that stopped closing (card padding and caption still
  close). Verified in the browser: arrow keys with both end stops, both click halves, a mouse drag
  each way, a vertical drag (nothing), a 3-tick trackpad swipe (exactly one picture, and the page did
  not navigate back), scrim / X / Esc close, the Tab trap, TechAssist's YouTube slide stepped over,
  and /projects still on MediaLightbox with its arrows and 1 / 3 counter. THE BUILDER CANNOT SEND
  TOUCH, but Framer routes mouse and touch through the same pointer events, so the mouse drag
  exercises the same settle path; the owner checked real touch in DevTools device mode. #72 (Tech
  chips: tag names are unreachable on touch devices) shipped and closed 2026-09-06, WHICH EMPTIES THE
  WORK QUEUE AT THE TIME (#73 was filed and built after it): only #53 (feel pass, the owner's to
  close) and #35 (the pinned map) stay open, so next_action is blank until a ticket is filed and
  green-lit. THE OWNER PICKED VARIANT A of three previews: where the browser reports it cannot hover,
  TechChip renders the pre-#69 text badge (the mark at 13x13 beside its name) instead of the icon-only
  chip, and a hover-capable device gets byte-identical markup to before. WHY BOTH REVEAL PATHS WERE
  DEAD ON A PHONE: Tailwind v4 wraps every hover: utility, group-hover/chip: included, in @media
  (hover: hover), so those rules do not exist on touch, and a tap never matches :focus-visible. The
  arbitrary variant [@media(hover:none)]: is used instead of a @custom-variant in globals.css so that
  exactly one shipped file changes. THE FALLBACK NEEDS ITS WRAPPER SPAN, because hidden and
  [@media(hover:none)]:contents both set display and a plain hidden on Badge would fight Badge's own
  inline-flex; the served CSS puts .hidden at line 955 and both @media (hover: none) blocks at
  3554/3560 inside the same @layer utilities (636 to 3565), so later source order makes the touch
  rules win. TechChip returns a fragment now, safe because both call sites put key on <TechChip>
  itself. Verified on desktop: /projects and the homepage drawer unchanged, and 1 of 14 tooltips lit
  with the cursor inside a card, so the named group from #69 still holds. THE BUILDER CANNOT TEST
  TOUCH (the extension emulates neither hover: none nor taps), so the touch branch was proven from the
  compiled CSS and checked by the owner in DevTools device mode. Two notes: npx next dev ALREADY
  ANSWERS ON THE LAN address it prints, so a phone check needs no -H 0.0.0.0; and walking
  document.styleSheets through javascript_tool found none of the utility rules, so curl the served
  stylesheet and grep it instead. #64 (Lab lightbox: click to enlarge images in THE LAB) shipped and
  closed 2026-09-06, emptying the #64 to #71 batch. A click on a homepage Lab card picture now opens
  SingleLightbox: one picture, no paging, no arrows, no counter, portaled to document.body because the
  Lab cards are scale-transformed sticky motion.divs. THE OWNER PICKED VARIANT C of three previews
  (dimmed page, the picture in a raised white card with its name below, the card dropping in with a
  small tilt) and the build tilts THE CARD, not the stage inside a still card, which is the one place
  it departs from the plan. MediaCarousel expandable is now "slideshow" | "single" instead of a
  boolean, so the two overlays are named at the call site and tsc refuses a third value; the
  expandable ? button : picture branch still works because both strings are truthy. ImageStage is
  EXPORTED from MediaLightbox rather than copied (its cached-layer trick is what makes the big picture
  paint on the first frame), and that one export keyword is the whole edit to that file. ANY CLICK
  CLOSES, the picture included, unlike MediaLightbox where only the scrim does. The stage is sized
  88vw x 78vh rather than to the picture, because next/image fill has no natural size before load;
  accepted consequence, checked at 375x812: on a phone a wide screenshot leaves grey gutters above and
  below it inside the card, nothing clipped, no sideways scroll. #69 (Tech chips: add logos for the
  unmapped BUILT WITH techs) shipped and closed 2026-09-04, leaving #64 as the only open ticket of the
  #64 to #71 batch. THE TICKET GREW A RESTYLE MID-BUILD: the plan was assets-plus-map-entries and said
  NO COMPONENT EDITS, but at the icon-sheet gate the owner asked for icon-only chips and picked
  variant A of three, so a tag with an official mark now shows the 20x20 mark ALONE and names itself
  in a label above it on hover or keyboard focus. Tags with no mark (iron-session, launchd) keep the
  text badge. 22 new assets in public/tech, 25 new techIcons keys, and a new
  components/ui/TechChip.tsx that ProjectsIndex and ProjectCard both call. THE TOOLTIP MUST USE A
  NAMED GROUP: ProjectCard.tsx:69-70 puts a plain group class on the card root and Tailwind
  group-hover: matches ANY hovered ancestor carrying group, so an unnamed group lit up every tooltip
  in the card at once whenever the cursor was anywhere on it; group/chip fixes it, and tsc cannot
  catch this, only the browser can. Both tag rows also needed pt-6, because the tooltip is absolute
  bottom-full and sits inside an overflow-hidden box in both places (the framer-motion height
  animation on /projects, the max-h-80 drawer on the card). Parent-brand marks are deliberate: Jira
  Data Center API and Jira REST API share jira.svg, Claude Code CLI and Claude Code Hooks share
  claude.svg, plus Vercel Functions, YouTube RSS, GitHub API, ESP32-C3 and terraria.wiki.gg. THREE
  SIMPLE-ICONS SLUGS ARE GONE from the current CDN (microsoftteams, powerautomate, openai all 404) and
  come from the pinned simple-icons@12 on jsDelivr with a fill added by sed; @13 and later 404.
  Near-black marks use the ink hex 1c1917, not 000000. python/jira/css were copied from public/logos
  and the Timeline is untouched. NEXT/IMAGE IS LAZY HERE, so a freshly expanded row reports
  naturalWidth 0 for a second or two and screenshots blank; that is not a broken asset.
  window.scrollTo and scrollIntoView do nothing on this site (a smooth-scroll library owns the scroll
  container), and the screenshot coordinate space is offset about +13px in x from
  getBoundingClientRect, enough to miss a 20px hover target. #72 was filed: hover and focus are the
  only ways to read a name, so touch devices cannot reach them. #65 (jiraPlane: play the plane
  animation as a real video slide) shipped and closed 2026-09-03, taken out of order ahead of #69.
  MediaItem gained a third type, "video", plus an optional poster, and both render sites branch on it:
  MediaCarousel builds the <video> in the same picture slot images use, so the expandable button, its
  aria-label and the focus-return ref all apply unchanged; MediaLightbox renders one in its stage AND
  its neighbour preload guard changed from the youtube-or-empty test to n.type !== "image", without
  which an mp4 would be handed to next/image. The asset is public/projects/jiraplane/flight.mp4,
  260,042 bytes, encoded off ~/Developer/jiraPlane/docs/media/flight.gif (9,404,846 bytes) at CRF 28,
  the owner's pick from three variants; the crop is 560x314 because yuv420p needs even dimensions. THE
  PLAN'S TRIAL ENCODE SIZES DID NOT REPRODUCE: the same command gave 610,946 / 260,042 / 118,628
  against the plan's 527,582 / 228,278 / 111,479, so re-measure rather than trusting a planned byte
  count. TWO ACCEPTED SIDE EFFECTS: the lightbox mounts its own <video>, so it starts at 0 instead of
  continuing from the row's copy; and a filter click remounts the row (#71), so the poster shows for a
  beat before playback resumes. #71 (Projects filter: switching filters collapses expanded rows)
  shipped and closed 2026-09-03, the fifth and last green-lit ticket of the #64 to #71 batch. ONE
  CHANGED LINE, ProjectsIndex.tsx:182: the row key went from key={p.title} to a template literal that
  prefixes the active filter. Each row's open flag is local state in ProjectRow
  (ProjectsIndex.tsx:30), so a row that survived a filter switch kept its key, its parent, and
  therefore its open state; a new key makes React unmount it and mount a fresh closed one. The
  rejected alternatives are in the plan and in HISTORY: an effect on group is the
  adjusting-state-on-prop-change pattern React tells you to replace with a key, and lifting open into
  the parent adds state plus an unwanted collapse animation. TWO ACCEPTED SIDE EFFECTS: clicking the
  tab that is ALREADY selected changes nothing (setGroup with the same value does not re-render, so an
  expanded row stays expanded, and the owner accepted that a click on the active tab is not a filter
  switch); and the remount re-fetches each row icon, so a 40x40 next/image can flash as an empty box
  for a beat after a filter click. No deviations from the plan and no preview variants (behaviour, not
  appearance). #70 (kal: fill the row icon box with the K mark) shipped and closed 2026-09-03, the
  fourth of the #64 to #71 batch. Two things changed and no component did: one added iconSrc line on
  kal's entry in lib/projects.ts, plus the new asset public/projects/kal/LOGO.png (180x180, 2589
  bytes). ProjectsIndex.tsx:46-55 already branches on iconSrc, so setting the field flips a row from
  the empty bordered box to a 40x40 next/image. THE KAL APPLE ICON IS NOT A FILE IN THE KAL REPO:
  app/apple-icon.tsx is a Next.js metadata route rendered at request time by ImageResponse, so the
  asset has to be fetched from the deployed site at https://kal-delta.vercel.app/apple-icon, WITH NO
  .png EXTENSION (that path 404s). It is public and curl-able. Do not use
  public/projects/kal/kalLogo.png, which is a wide wordmark banner and illegible at 40px; it stays as
  kal's first media slide. No deviations from the plan and no preview variants (the ticket pinned the
  asset and the box already existed). One thing worth carrying, now a gotcha below: the FIRST
  /projects render after starting the dev server showed the pre-edit empty box, and one re-navigate
  showed the K with no code change between. #68 (Remix: reframe as a GDSC Sprint project) shipped and
  closed 2026-09-03, the third of the batch. ProjectStatus gained a fifth member, "sprint", and Remix
  moved onto it: five changed lines, the union plus Remix's status and description in lib/projects.ts,
  plus one key in each of the two label maps (rowLabel in ProjectsIndex, statusLabel in ProjectCard).
  BOTH MAPS ARE as const AND INDEXED BY STATUS, so tsc refuses to compile until each has the new key,
  which is what makes a new status member self-enforcing instead of a thing to remember. The maps
  still disagree for project ("Personal" on the row, "Project" on the card, owner pick at #30); for
  sprint both say "Sprint". Two things #68 left behind: REMIX NOW HAS THE LONGEST DESCRIPTION ON THE
  SITE, 253 chars against CometAdvisor's 136, so it is the new worst case for Lab card height; and THE
  BROWSER EXTENSION REFUSES TO RESIZE THE WINDOW to phone widths ("bounds must be at least 50% within
  visible screen space") while the site's smooth scroll swallows programmatic scrolling inside an
  injected iframe, so a mobile screenshot is not reachable and narrow-width checks have to be done by
  measurement in an iframe instead. #66 and #67 shipped and closed 2026-09-01, the second and first of
  the batch: one MediaItem removed from lib/projects.ts plus a git rm of the PNG, and one MediaItem
  inserted at index 2. Neither changed a component, because the carousel and the lightbox both read
  media in order. /projects IS A COLLAPSED ACCORDION, so nothing about a project's carousel exists in
  the DOM until the row is clicked open; and next/image srcs are query-string encoded, so reading them
  back through javascript_tool trips the cookie/query-string block unless you decodeURIComponent and
  split off everything from ? onward.
---

# personalWebsite — Project State

Personal portfolio site. Next.js 16 (App Router, Turbopack) + React 19 + Tailwind v4 +
Framer Motion. Single page (`app/page.tsx`): Hero (header, bio folded in) → StickmanRunner → Timeline →
Education → LossGraph → The Lab → Passions → Footer. Repo: github.com/godfreyponce/portfolio (private).

*Thin snapshot. `next_action` above names the ticket that is up now — start there.
Archive: `docs/HISTORY.md`. Queue: GitHub Issues (`gh issue list`). Protocol: `AGENTS.md`.*

## Now

- Council-climb ship, #78 to #82, green-lit and run by an orchestrator thread (council-climb
  decision 33). #78 landed. #80 is accepted and lands next; #79, #81 and #82 then run in
  parallel, one worktree each. #77 (the full check's `pkill -f "next dev"` stops other worktrees'
  dev servers) is not green-lit, so nobody runs that line.
- Feel pass #53: every build ticket under it has landed (#55 to #60, #62, #63, #61). #53 itself
  is still open; closing it is the owner's call.
- Map issue #35 is pinned; regenerate `docs/decision-map.html`
  at every ticket close (command in AGENTS.md, "Question tickets").
- Pre-existing tree items (owner's, don't touch): unstaged deletion of
  agent_architecture_strategy.md, untracked Icon file, untracked older `docs/superpowers/plans/*` files
  (since #76, each ticket's plan rides in its docs commit).

## Run / verify (do this first)

```bash
pkill -f "next dev"      # ALWAYS kill existing dev servers first; only ONE at a time
npm run dev              # http://localhost:3000
npx tsc --noEmit         # run ONCE at the end of a change, not in a loop
```
No `npm run build` to verify changes; no `npm install` unless the owner asks.
Verify visually via Chrome automation at localhost:3000 (scroll the whole page).

## Gotchas (short form — full detail in docs/HISTORY.md)

- **`phase` in the head is a `>-` block scalar (#75). Never turn it back into a one-line quoted
  string**: one raw `"` inside a double-quoted value breaks js-yaml, gray-matter and Psych on the
  whole head, and that went unseen from #64 to #74. At accept, add the new entry as two-space-indented
  lines at the top of the block, no quotes, no escaping, no line starting with extra spaces (a
  more-indented line keeps its newline). Then parse the head once with `js-yaml` before committing.
- The FIRST page render after starting the dev server can show pre-edit data (#70): `/projects`
  came back with kal's old empty icon box even though the `lib/projects.ts` edit predated
  `npm run dev`, and one re-navigate showed the new icon with no code change and no console error
  in between. Reload once before debugging an edit that looks like it did not take.
- A `/projects` row icon can also flash as an empty box right after a FILTER CLICK (#71): the
  row key carries the active filter, so a switch remounts every row and its 40x40 `next/image`
  loads again. It fills in. Not a missing `iconSrc`.
- A running dev server serves STALE CSS after a `globals.css` `@theme` or `next/font` edit.
  In #62 `--font-display` kept resolving to the deleted `--font-fraunces`, so every serif fell
  back to Geist through hard reloads. `pkill -f "next dev"; rm -rf .next; npm run dev`. Suspect
  this BEFORE debugging the CSS.
- The Chrome extension cannot resize the page viewport here: `resize_window` returns success and
  `document.documentElement.clientWidth` does not move. **osascript bounds DID reach it in #73**,
  which corrects the old "they do not" line: `activate` plus `set active tab index` cleared a
  `hidden` visibilityState, and `set bounds of front window to {24, 57, 1304, 961}` moved
  `innerWidth` from 1464 to 1280. It did not hold: later in the same session `innerWidth` was back
  at 1464 with no call in between, and the `computer` screenshots changed size with it. So a width
  set this way is not a width you can assume later. MEASURE the viewport in the same call that uses
  it, and take click coordinates from a `getBoundingClientRect` read at that moment.
- **To catch a crossfade mid-flight, dispatch the key and sample in ONE `javascript_tool` call**
  (#73). The round trip between two tool calls always exceeds a 200ms fade, so a press-then-look
  check reads one layer every time and looks like no crossfade at all. A synthetic
  `new KeyboardEvent('keydown', ...)` on `document` reaches a plain document-level listener, so
  `dispatch, await 90ms, read, await 400ms, read` catches both layers (0.39 and 0.61 opacity) and
  then the single settled one.
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
- **A frozen `AnimatePresence mode="wait"` has a headless cure: emulate reduced motion** (#65).
  With no frames, the exit animation never finishes, so the incoming child never mounts: a lightbox
  ArrowRight updates the counter to `2 / 2` while the stage still holds the old slide. Over CDP,
  `Emulation.setEmulatedMedia` with `prefers-reduced-motion: reduce` removes the exit animation
  entirely, so the swap is instant and needs no rAF. That is how #65 verified the lightbox once it
  turned out Chrome could not be raised above a fullscreen terminal: the tab reported
  `visibilityState: "hidden"` no matter how often `activate` ran, which also PAUSES video playback.
  Muted autoplay video needs a visible tab, or headless with `--autoplay-policy=no-user-gesture-required`.
- **The automation tab must be the ACTIVE tab of its Chrome window** (#51). `visibilityState`
  reads `hidden` and zero animation frames run when the extension's tab sits behind another tab,
  and raising the window, signing in, or making a fresh tab group does not fix it. Symptoms:
  `outerWidth`/`outerHeight` read 0, drags arrive as plain clicks, `AnimatePresence` crossfades
  never finish so the incoming slide never mounts (counter says `4 / 4`, no iframe). Fix from the
  terminal: `osascript -e 'tell application "Google Chrome" to set active tab index of window 1
  to N'` (list tabs with `title of every tab of window 1`). Gate every animated check on
  `document.visibilityState === "visible"` and one `requestAnimationFrame` actually firing.
- **Headless Chrome over CDP DOES run animation frames** (#64, Chrome 152, `--headless=new`), which
  corrects the "exact viewport, NOT motion" line above. A Framer Motion enter animation was caught
  mid-flight at 120ms and settled afterwards, and a synthesised `Input.dispatchMouseEvent` drag
  reached Framer's drag detection and paged the carousel. So the drag check and the motion check are
  no longer owner-side; only the extension's tab is. The rAF-dead readings above came from the
  EXTENSION's backgrounded tab, not from headless.
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
- A synthetic `mouseover` alone does NOT fire a React `onMouseEnter` (#74): React derives enter
  from the pair, so dispatch `mouseout` on the element the pointer leaves with `relatedTarget` set
  to the target, then `mouseover` on the target with `relatedTarget` set back. With only the
  `mouseover`, the streak count-up read 71 at 150ms and looked broken; with the pair it read 40.
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
