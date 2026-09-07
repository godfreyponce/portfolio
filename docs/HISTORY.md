# personalWebsite — Build History & Reference

*Archived from STATE.md on 2026-07-13. STATE.md is now a thin quick-resume snapshot; this file holds the full build archive and per-feature detail. The work queue lives in GitHub Issues.*

## Session changelog

*2026-07-09 · LossGraph divider rewritten to "ghost runs" training animation
(owner picked V1b from HTML variant previews) — committed + pushed (`b1a3f53`, `a521ace`).
Previous session (2026-07-07) shipped + pushed 6 feature commits (`45936f3..0b2bd35`):
scroll-driven stickman, scroll-stacking Lab cards, crossfading carousel, retina-sharpened
images, GitHub contribution heatmap, brand icons on tech tags, Signal card removed.
Everything below was verified in the browser + `tsc --noEmit` clean.*

### 2026-09-06 — Clicking a Lab card image enlarges it, one picture, no paging (#64)

Last ticket of the #64 to #71 batch. The homepage Lab carousel had all of #49's click plumbing
sitting unused: `ProjectCard` mounted `MediaCarousel` without `expandable`, so a click did
nothing. This ticket turns it on and gives it its own overlay instead of reusing the /projects one.

- **Owner picked variant C of three**, from the throwaway `public/preview-64.html` (deleted after
  the pick, never committed). A = cream page, hairline border, mono caption. B = near-black page,
  picture alone, no caption. C = dimmed page, the picture in a raised white card with the name
  below it in Spectral, the card dropping in with a small tilt. All three drop the /projects panel,
  arrows, counter and title footer; that absence is most of what makes them "visibly different".
- **One deviation from the plan, visible in the preview the owner picked from**: the tilt runs on
  the card, not on the stage inside a still card. "A raised paper card dropped on the page" means
  the card moves. The transform still never touches the `fixed` root.
- **`expandable` is a union now, not a boolean**: `"slideshow" | "single"`. `ProjectsIndex` passes
  `"slideshow"` (the #49 overlay, byte-for-byte unchanged), `ProjectCard` passes `"single"`. The
  `expandable ? <button> : picture` branch still works because both strings are truthy, and `tsc`
  refuses a third value. Keeping the boolean and adding a second prop would spell one choice twice.
- **`ImageStage` is exported from `MediaLightbox`, not copied.** It is the two-layer trick (cached
  carousel-sized request underneath, large render faded in on load) that makes the big picture paint
  on the first frame. Its `sizes` string already asks for a rendition wider than the new stage, so
  `SingleLightbox` needed no `sizes` of its own. That one `export` keyword is the entire edit to
  `MediaLightbox.tsx`.
- **Any click closes, including a click on the picture.** `MediaLightbox` closes only on the scrim,
  because its panel holds arrows and a footer worth clicking. Here the viewport is one picture with
  nothing else to do. Esc and the X close too. The owner accepted this at gate 2 without changing it.
- **The stage is sized in `vw`/`vh` (88 x 78), not to the picture.** `next/image` `fill` has no
  natural size to read before load. The consequence, checked at 375x812 and accepted at gate 2: on a
  phone a wide screenshot fills the width and leaves grey gutters above and below it inside the
  card. Nothing is clipped and the page does not scroll sideways (`scrollWidth` 375 vs client 375;
  the card lands at left 10, right 366).
- **Verified in the running site at 1280x900**: overlay is a child of `<body>`, one button inside it
  (the X, so no arrows and no counter), focus starts on the X and returns to the clicked slide
  button on close, `body` overflow locked and restored, a real wheel over the overlay left `scrollY`
  at 0 while the same wheel with no overlay moved it 1940 to 2845, a 220px mouse drag paged the
  carousel and opened nothing while a plain click on the same spot opened it, TechAssist's YouTube
  slide is still not wrapped in a zoom button (13 zoom buttons for 14 slides), and /projects still
  reports `CometAdvisor slideshow`, `Close slideshow`, `1 / 4`, two buttons.
- **Correction to a gotcha: headless Chrome over CDP DOES run animation frames here.** STATE.md said
  it buys an exact viewport but not motion. Under `--headless=new` on Chrome 152 the card was caught
  mid-animation at 120ms (`matrix(0.9937, -0.0055, ...)`, opacity 0.786) and settled to
  `transform: none` afterwards, and a synthesised `Input.dispatchMouseEvent` drag reached
  Framer Motion's drag detection and paged the carousel. Reduced motion emulated through
  `Emulation.setEmulatedMedia` gave `transform: none`, opacity 1 at 120ms, so the reduced path is
  real and not just a frozen frame. Both the drag check and the motion check, which past tickets
  handed to the owner, ran unattended.

### 2026-09-04 — BUILT WITH tags become brand marks that name themselves on hover (#69)

Only 11 of the 36 tags in `techIcons` had a mark, so hackathon projects looked iconified and
everything else read as plain text. Every tag with an official mark now has one, and the chip
itself was restyled: a tag with a mark shows the 20x20 mark **alone**, and reveals its name in a
small bordered label above it on hover or keyboard focus. Tags with no official mark keep the
text badge. 22 new assets in `public/tech/` (21 SVG + `nitter.png`), 25 new `techIcons` keys, and
a new component `components/ui/TechChip.tsx` that both render sites call
(`ProjectsIndex.tsx`, `ProjectCard.tsx`).

- **The restyle was not in the plan.** The plan was assets-plus-map-entries, explicitly "No
  component edits." At the icon-sheet gate the owner asked for icon-only chips with the name on
  hover, picked variant A of three (bare marks + tooltip; square chip that widens; bare marks +
  one shared name line), and the build grew a component. The other two variants are described in
  the plan-gate exchange only; the throwaway `public/preview-tech.html` was deleted.
- **The tooltip MUST use a named group.** `ProjectCard.tsx:69-70` puts a plain `group` on the
  card root. Tailwind's `group-hover:` compiles to `.group:hover &`, which matches **any**
  hovered ancestor carrying `group` — so with an unnamed group, moving the cursor anywhere on a
  Lab card lit up every tag's tooltip at once, stacked on top of each other. `group/chip` +
  `group-hover/chip:` fixes it. This was caught in the browser at gate 2, not by `tsc`.
- **Both tag rows needed `pt-6`.** The tooltip is `absolute bottom-full mb-2`, and the row it
  sits in is inside an `overflow-hidden` box in both places (the framer-motion height animation
  on `/projects`, the `max-h-80` drawer on the card). Without top padding the label is clipped.
  On the card the padding went on the header row, not the tags div, so the date stays aligned.
- **Parent-brand marks are deliberate.** A tag naming a brand's product or API borrows that
  brand's mark: `Jira Data Center API` and `Jira REST API` share `jira.svg`, `Claude Code CLI`
  and `Claude Code Hooks` share `claude.svg`, `Vercel Functions` → Vercel, `YouTube RSS` →
  YouTube, `GitHub API` → GitHub, `ESP32-C3` → Espressif, `terraria.wiki.gg` → wiki.gg. The
  ticket itself established the rule by offering `public/logos/jira.svg` for the Jira tags.
- **`iron-session` and `launchd` have no official mark** and stay text-only. Owner decision on
  the ticket: no invented or generic placeholder icons.
- **Three simple-icons slugs are gone from the current CDN** (`microsoftteams`, `powerautomate`,
  `openai` all 404 on `cdn.simpleicons.org`). They still exist in the pinned npm release at
  `https://cdn.jsdelivr.net/npm/simple-icons@12/icons/<slug>.svg`; `@13` and later 404. Those
  files carry no `fill`, so the build added one with `sed`. Hexes: Teams `6264A7`,
  Power Automate `0066FF`, OpenAI `412991`.
- **Near-black marks use the ink token `1c1917`, not `000000`** — Next.js, Vercel, GitHub,
  Adafruit — matching the existing `elevenlabs.svg` precedent. `python.svg`, `jira.svg` and
  `css.svg` were **copied** from `public/logos/` (the Timeline set), byte-identical to a fresh
  fetch; the Timeline is untouched and was spot-checked at gate 2.
- **Nitter has no simple-icons entry.** Its mark is the project's own
  `raw.githubusercontent.com/zedeus/nitter/master/public/logo.png` (500x500, 1865 bytes). A PNG
  in `public/tech/` has precedent (`nebula.png`).
- **`next/image` here is `loading="lazy"`, which makes verification lie.** A freshly expanded row
  reports `naturalWidth: 0` / `complete: false` for a second or two, and a screenshot taken then
  shows blank gaps where the marks are. That is not a broken asset. Also `window.scrollTo` and
  `scrollIntoView` do nothing on this site (smooth-scroll library owns the scroll container) — use
  the extension's real scroll action. And **the screenshot coordinate space is offset roughly
  +13px in x from `getBoundingClientRect`**, enough to miss a 20px hover target.
- **Follow-up filed as #72:** hover and keyboard focus are the only ways to read a name, so on a
  touch device the names are unreachable. Flagged at the pick gate and deferred, not solved here.
- The plan's step-4 check predicted 22 "ok" lines; only 21 are SVG (Nitter is a PNG and is not in
  that loop). The count of 22 new files is right.
- `npx tsc --noEmit` exited 0 with no output. Verified in the browser on `/projects` (kal:
  3 marks + `iron-session` text; Jira-Alerts: 4 marks + `launchd` text) and on the homepage Lab
  card drawer (CometAdvisor), including that only the hovered mark shows its name.

### 2026-09-03 — jiraPlane's flight plays as a video slide (#65)

jiraPlane's second slide on `/projects` was frame 24 of a 9,404,846 byte gif, a still, so the
animation the project is named for was invisible. It now plays: muted, looping, no controls,
gif-like. 28 insertions and 4 deletions across three files, plus one new asset,
`public/projects/jiraplane/flight.mp4` at 260,042 bytes, which is 2.8% of the source gif.

- **`MediaItem` gained a third type and one optional field.** `type: "image" | "youtube" | "video"`
  and `poster?: string` (`MediaCarousel.tsx:10-18`). A video item is
  `{ type: "video", src: <mp4>, poster: <png>, alt }`. The still that used to be the slide,
  `jiraplane.png`, is kept and is now the poster.
- **The carousel change is one branch in the `picture` slot** (`MediaCarousel.tsx:176-187`), in
  front of the existing contain and cover branches. Everything wrapping `picture` is untouched, so
  the video inherits the expandable button, its `aria-label`, the ref that returns focus on close
  (#49), and the `dragged` guard. A `<video>` with no `controls` is not interactive content, so it
  is valid inside that `<button>` and stays out of the Tab order.
- **The lightbox needed two edits, not one.** The stage gained a video branch between youtube and
  `ImageStage` (`MediaLightbox.tsx:277-287`), using `h-full w-full object-contain` rather than
  `max-h-full max-w-full`, which would have shown a 560px video at native size in a ~1060px stage.
  The neighbour preload guard also had to change, from `(n.type === "youtube" && n.videoId) ||
  !n.src` to `n.type !== "image" || !n.src` (`MediaLightbox.tsx:240`): a video has a `src`, so the
  old test would have handed `flight.mp4` to `next/image` and asked the optimizer for an mp4.
  Verified: one request for `flight.mp4`, zero `/_next/image` requests containing `mp4`.
- **The lightbox plays the video rather than being non-clickable like YouTube slides.** The plan
  decided this and the ticket left it open. The lightbox pages with arrows through every item, so
  its stage has to render a video regardless; making the carousel slide non-clickable would have
  added a branch without removing one.
- **CRF 28, the owner's pick from three variants** (23 / 28 / 33) previewed at both call-site
  widths, 838px `cover` for the row and 1060px `contain` for the stage. 23 more than doubled the
  bytes on a source that is already a soft phone video; 33 smeared the Jira tag text.
- **The plan's trial encode sizes did not reproduce.** The same command produced 610,946 / 260,042
  / 118,628 against the plan's 527,582 / 228,278 / 111,479. All three still cleared "meaningfully
  smaller", so the pick was unaffected, but a planned byte count is worth re-measuring.
- **Two accepted side effects.** The lightbox mounts its own `<video>`, so it starts at 0 instead
  of continuing from the row's copy; a 9 s loop, and a gif would do the same. And a filter click
  remounts the row (#71), so the poster shows for a beat before playback resumes.
- **All slides stay mounted** (`MediaCarousel.tsx:154`), so the video plays behind slide 1 from the
  moment the row opens. That is the gif behaviour the ticket asked for. It is not paused when it is
  not the active slide, deliberately. Reduced motion does not pause it either, for the same reason.
- **Nothing reaches the homepage.** `ProjectCard` does SSR its carousel, where React's known
  missing-`muted`-attribute quirk could block autoplay until hydration, but jiraPlane is not
  `featured`, so no video renders there. Re-check autoplay on that surface if one ever does.
- **Verification could not run through the Chrome extension**, and the reason is now a STATE.md
  gotcha. Chrome sat behind a fullscreen terminal, so the tab reported `visibilityState: "hidden"`
  through every `activate`; a hidden tab pauses muted autoplay video and freezes the
  `AnimatePresence mode="wait"` crossfade, so ArrowRight moved the counter to `2 / 2` while the
  stage kept the old slide. Headless Chrome over CDP with `prefers-reduced-motion: reduce` emulated
  cleared both: reduced motion removes the exit animation that needed frames. Node 24's built-in
  `WebSocket` drove CDP directly, with no puppeteer or `ws` in the tree.
- **No deviations from the plan** beyond the encode sizes above and the verification route.

### 2026-09-03 — Filter switches collapse every row on /projects (#71)

Clicking a filter tab on `/projects` used to leave already-expanded rows expanded. Now every
filter click, including back to All, leaves every visible row collapsed. One changed line,
`ProjectsIndex.tsx:182`: the row key went from `key={p.title}` to
`key={`${group}-${p.title}`}`. Nothing else in the file, and no other file, changed.

- **Why the bug existed.** Each row's `open` flag is local state inside `ProjectRow`
  (`ProjectsIndex.tsx:30`). A switch from All to one group unmounts the other sections, so their
  rows lose their state, but the surviving section and its rows keep their keys and their parent,
  so React reconciles them in place and `open` survives. Compounding the key with `group` means a
  switch gives every row a new key, React unmounts the old one and mounts a fresh one with
  `open === false`.
- **Why the key and not an effect or lifted state.** `useEffect(() => setOpen(false), [group])`
  needs `group` as a prop, renders once open then once closed, and is the "adjusting state on
  prop change" pattern the React docs say to replace with a key. Lifting `open` into the parent
  as a set of titles adds state, props, and an unwanted collapse animation on the surviving rows.
  Both rejected in the plan; the owner's rule is simplest wins.
- **Clicking the tab that is already selected changes nothing.** `setGroup` with the same value
  does not re-render, keys do not change, and an expanded row stays expanded. Predicted in the
  plan, confirmed at gate 2, accepted as-is: a click on the active tab is not a filter switch.
- **The remount re-fetches each row's icon,** so a row's 40x40 `next/image` can show as an empty
  box for a beat after a filter click, then fill in. Same first-render lag #70 documented, now
  reachable without a dev-server restart. Cosmetic, not a regression from this edit.
- **No preview variants.** The ticket changes behaviour, not appearance; nothing new is drawn, so
  the owner's 3-variant rule had nothing to pick from. Called out in the plan.
- **No deviations from the plan.** Verified in the browser across all five checks in the plan's
  step 4 (switch away, expand/collapse inside a filter, switch back to All with the whole page
  scrolled, two rows expanded in two sections then filtered to one, and the active-tab click).
  `npx tsc --noEmit` exited 0 with no output.

### 2026-09-03 — kal's row icon box filled with the K mark (#70)

The kal row on `/projects` rendered the empty bordered placeholder square because its entry had
no `iconSrc`. It now shows the bone-on-ink K, the same mark iOS puts on the home screen. Two
things changed: one added line in `lib/projects.ts` (`iconSrc: "/projects/kal/LOGO.png"`, placed
after `date` to match cometadvisor / remix / nudge) and one new asset,
`public/projects/kal/LOGO.png` (180x180 RGBA, 2589 bytes). No component changed —
`ProjectsIndex.tsx:46-55` already branches on `iconSrc` and renders a 40x40 `next/image` with
`rounded-sm object-contain border border-rule`, so setting the field flips kal from the
empty-box branch to the image branch.

- **The apple-touch-icon is not a file in the Kal repo.** `~/Developer/Kal/app/apple-icon.tsx` is
  a Next.js metadata route that renders the icon at request time with `ImageResponse`: 180x180,
  square corners, background `#1F2421`, one "K" in `#F7F6F3`. iOS rounds the corners itself. So
  the asset has to be fetched from the deployed site, at
  `https://kal-delta.vercel.app/apple-icon` — **no `.png` extension, that path 404s**. It is
  public (Kal's `proxy.ts` matcher excludes `apple-icon` from auth) and a plain curl returns
  `200 image/png 2589`. The K renders in satori's default sans, not the Georgia the source asks
  for; that is what the home screen shows, so it is correct. Do not "fix" the font.
- **`public/projects/kal/kalLogo.png` is the wrong asset** and stays where it is as kal's first
  media slide. It is a wide wordmark banner, illegible at 40px.
- **The first `/projects` render after starting the dev server showed the old, empty box.** One
  re-navigate showed the K, with no code change in between and no console error either time. The
  file served fine the whole time (`/projects/kal/LOGO.png` → `200 image/png 2589`, and
  `/_next/image?...w=96&q=75` → `200 image/png 555`). Reload before debugging a `lib/projects.ts`
  edit that looks like it did not take.
- **No preview variants.** The ticket pinned the asset and the 40px box already existed, so the
  owner's 3-variant rule had nothing to pick from. Called out in the plan.
- **No deviations from the plan.** Every step's expected output matched, including the byte count.
- Spot-checked at gate 2: the four rows that already had logos (CometAdvisor, Remix, Nudge,
  TechAssist) still show them, and the empty-box rows (Debrief, glass, jiraPlane, Jira-Alerts,
  clawd) are still empty. `npx tsc --noEmit` exited 0 with no output.

### 2026-09-03 — Remix reframed as a GDSC Sprint project (#68)

`ProjectStatus` gains a fifth member, `"sprint"`, and Remix moves onto it. Five changed lines
total: the union in `lib/projects.ts`, Remix's `status` and `description` in the same file, one
key in `rowLabel` (`ProjectsIndex.tsx`), one key in `statusLabel` (`ProjectCard.tsx`). Remix's
pill now reads `Sprint` on the /projects row and on the homepage Lab card, and the description
closes with "Built at my GDSC (Google Developer Student Club) machine learning sprints event."
The other seven `status: "project"` entries are untouched and still read `Personal`.

- **A new union member, not a remap.** The ticket asked for this explicitly. Both label maps are
  `as const` objects indexed as `map[status]`, so `tsc` refuses to compile until each has the new
  key. That is what makes the two-map edit self-enforcing rather than a thing to remember.
- **The two maps still disagree for `project`** ("Personal" on the row, "Project" on the card,
  owner pick at #30). For `sprint` there is no such split: both say "Sprint".
- **One deviation from the plan, in the plan's arithmetic.** The plan expected 9
  `status: "project"` entries before the edit and 8 after. There were 8 before and 7 after, so
  the plan's "expect 8 `Personal` pills" check was off by one. Verified live: 7 `Personal`, 1
  `Sprint`, 3 `Hackathon`, which is all 11 projects.
- **No preview variants.** The pill is an existing `Badge` whose text changes and the ticket fixed
  the word, so the owner's 3-variant rule had nothing to pick from. Called out in the plan.
- **Remix now has the longest description on the site**, 253 characters against CometAdvisor's
  136, so it is the new worst case for Lab card height. Worth knowing before anyone lengthens
  another description.
- **The browser extension refuses to resize the window to phone widths** ("bounds must be at least
  50% within visible screen space"), and the site's smooth scroll swallows programmatic scrolling
  inside an injected iframe, so a mobile screenshot was not reachable. The narrow-width check was
  done by measurement instead: the page loaded in a 386px iframe, description bottom 72px above
  the card's clip box, "View project" button 25px above it, no horizontal overflow.
- Gates: `tsc --noEmit` clean, exit 0, no output. No console errors on either page.

### 2026-09-01 — Duplicate Jira-Alerts slide removed (#66)

One data edit: one `MediaItem` removed from Jira-Alerts' `media` array in `lib/projects.ts`, plus
`git rm public/projects/jira-alerts/jira-alerts.png` (106222 bytes, 744x260). `git diff` is
exactly `-1`. No component changed, for the same reason as #67: the carousel and the lightbox both
read `media` in order, so the flow shot became slide 2 on its own and the dot labels renumbered
themselves. Slides 1 and 2 had been the same picture, because the banner's own payload IS the
Teams notification screenshot and slide 2 was that shot cropped tight. Two slides remain: banner,
then the Power Automate flow shot.

- **No deviations from the plan.** The plan's one correction to the ticket held up: the live
  reference is `lib/projects.ts:177`, not :176 as the ticket said. Grep confirmed exactly one live
  hit before the edit; the other hits are historical plan files under `docs/plans/`.
- **No preview variants.** A deletion offers nothing to pick from, so the owner's 3-variant rule
  had no material. Called out in the plan rather than skipped silently.
- **`/projects` is a collapsed accordion.** Nothing about a project's carousel exists in the DOM
  until its row is clicked open. A first pass that greps for `img` or dot buttons on page load
  finds zero of both and looks like a broken change. Click the row first.
- **`next/image` srcs are query-string encoded**, so reading them back through `javascript_tool`
  trips the cookie/query-string block. `decodeURIComponent` the src and split off everything from
  `?` onward to get a readable filename.
- Verified live: two dots, `Go to slide 1` and `Go to slide 2`; slide 2 is the flow shot; the
  lightbox reads `2 / 2` on the flow shot and `1 / 2` on the banner; no broken image, no 404 in
  the dev server log. The one console entry is a pre-existing Next.js LCP hint about the banner.
- Gates: `tsc --noEmit` clean, exit 0, no output.

### 2026-09-01 — HackAI team photo as CometAdvisor slide 3 (#67)

One data edit: one `MediaItem` inserted at index 2 of CometAdvisor's `media` array in
`lib/projects.ts`, plus the asset `public/projects/cometadvisor/comet-hackai.jpg` (1086x724
JPEG). `git diff` is exactly `+1`. No component changed, because the carousel and the lightbox
both read `media` in order, so the stack shot moved to slide 4 on its own and the dot labels
renumbered themselves. Alt text is the owner's wording from green-light: "The CometAdvisor team
presenting at HackAI". No preview variants: the owner waived the 3-variant rule at green-light
because the ticket had already fixed the one visual call.

- **No `fit: "contain"`.** The ticket's named fallback was left unused because the crop is good
  at every width checked. On `/projects` the box is 3:2 and so is the photo, so object-cover
  shows the whole frame. On the home Lab card the box is wider than tall, so the sides trim, and
  all three faces plus the HackAI sign survive.
- **The plan was wrong about the home card's geometry.** It described `ProjectCard`'s non-stack
  featured branch (`aspect-video`, `md:aspect-auto md:w-1/2 md:min-h-96`). The Lab deck renders
  the `stack` branch instead: `h-64 w-full ... md:h-full md:w-[55%]`, measured live at 495x440
  desktop and 343x256 mobile. The mobile box is 1.34, not 16:9, so the plan's predicted "loses
  about 15% of its height" never happens; the trim is on the sides.
- **There is no lightbox on the home card**, so the plan's step to open one there could not be
  run. Only `ProjectsIndex.tsx:84` passes `expandable` to `MediaCarousel`; `ProjectCard` never
  does. This is already ticketed as #64 (Lab lightbox), so nothing new was opened. The
  `/projects` lightbox was verified: it opens on the photo, reads `3 / 4`, renders
  `object-contain` with the full frame, and arrows on to the stack shot at `4 / 4`.
- **The mobile shot is a simulated box, and the owner was told at gate 2.** `resize_window` was
  refused on the fullscreen Chrome window (the existing gotcha), so the media pane was set to
  343x256 in the live page, screenshotted, and reverted with a reload. The crop inside that frame
  is the real mobile crop; the page around it is not mobile.
- **A large PNG reads as a blank panel in dev before it decodes.** Lightbox slide 4 rendered
  empty for several seconds after the crossfade landed, then painted the stack shot. Not a bug
  and not caused by this change; wait and re-shoot before chasing it.
- Gates: `tsc --noEmit` clean, exit 0, no output.

### 2026-09-01 — Middle dots and an em dash out of the shipped copy (#61)

Copy only: three string literals in three components, no structural, style or behaviour change.
The ticket named the under-construction banner; the plan's full-repo sweep found two more
violations of the no-middle-dots rule (owner rule 2026-07-17), and the ticket's own second
Done-when bullet ("no other shipped string on home or /projects") covered them, so all three
shipped in one commit.

- **The banner separates with non-breaking spaces and no character at all.** The owner picked
  variant A (spacing only) at gate 0 from a 3-variant preview (`public/preview-61.html`, deleted
  at wiring). `ProjectCard.tsx:82` is now a JSX string expression carrying five `\u00A0` escapes
  per gap: plain spaces collapse to one when the browser renders them, so the gap has to be
  non-breaking, and writing them as escapes keeps them visible in `git diff`.
- **The loss-graph readout uses pipes, not commas**, because the step count already renders with
  a thousands comma. Seven ` · ` occurrences across the five lines the plan named in
  `LossGraph.tsx` (lines 168 and 175 carry two each, which is why the count is seven and not
  five). A grep confirmed all seven sat on those lines before the replace.
- **The contribution-grid tooltip uses a colon**: `ProjectStack.tsx:29`, now
  `${d.date}: ${d.count} contribution(s)`.
- **NO PROJECT CARRIES `status: "building"` TODAY**, so the banner renders nowhere on the real
  site. To look at it the build set CometAdvisor to `building`, checked it, and set it back;
  `lib/projects.ts` has zero diff. Any future session verifying that banner has to do the same
  thing, and nobody should read "banner not found on the page" as a bug.
- **The banner already wrapped mid-phrase and still does.** At a 1568px viewport the featured
  card's 496px media pane renders `UNDER CONSTRUCTION  UNDER CONSTRUCTION  UNDER` over
  `CONSTRUCTION`. Both strings were measured in the same box: 61px tall at 496px wide, 56px at
  343px (the mobile full-bleed pane), old dot version and new nbsp version IDENTICAL. So the
  separators changed nothing about the wrap. Layout was out of scope in the ticket and the owner
  accepted at gate 2 having been told.
- **Verified live, not in source.** The readout read `run 2 | step 4,047 | loss 1.448 | best
  0.059` while animating and `run 2 | loss 0.033 ★ new best` when held. That is three of the four
  rendered branches; the fourth (` | best X ✓`) came out of the same mechanical replace and its
  ` | best` half was seen in the animating string. The tooltip read `2025-08-31: 0 contributions`
  off the `title` attribute. /projects is a compact list view with no media pane, so it renders
  no banner at all, and `document.body.innerText` there carries neither character.
- Gates: `grep -rn '·\|—' app components lib --include='*.tsx' --include='*.ts'` returns nothing,
  `tsc --noEmit` clean.

### 2026-09-01 — Site-wide type match to genesiating (#62)

Closes the #53 feel pass's type work. The site had two serifs and a ramp set by taste; it now has
one serif and a ramp copied from measurements. Six commits on branch `issue-62`, merged at accept.

**The reference stack, corrected.** #60's record (Libre Baskerville display, system sans body,
IBM Plex Mono labels) was WRONG on every line. Read off genesiating's live computed styles and
`@font-face` rules on 2026-09-01: **Freight Text** (serif, Cargo-licensed) for the h1 name and
card titles, **Monument Grotesk Variable** for body, **Golos Text** for the grey labels. Their CSS
requests serif weights 200 and 500 but only Book(400) and Bold files load, and browsers do not
synthesise lighter weights, so what actually renders is **Book 400**, not 200. Spectral is our
free stand-in, picked by the owner at gate 0 from a 3-variant preview against Libre Baskerville
and Fraunces.

**Normalising is mandatory.** Measured at a 2545px viewport (their root font-size is fluid:
20.736px at 2560px) and normalised to 1440px. A raw px reading off that site means nothing
without a stated width. Letter-spacing is copied as fixed px, not em, because theirs is fixed px.

| tier | before | after | genesiating @1440 |
|---|---|---|---|
| h1 name | 27px Libre Baskerville | 29px Spectral 400, -0.7px, lh 1.3 | 29.33px |
| card title (h3) | 22px Fraunces 500 | 16.5px Spectral 500, -0.3px, lh 1.3 | 16.48px |
| list title (label) | 18px Geist 600 | 15.25px Geist 600, lh 1.7 | 15.25px |
| body | 18px, lh 1.625 | 15.25px, lh 1.7 | 15.25px, lh 1.70 |
| section label (h2) | 13px Geist 400 | unchanged (#63) | 12.91px |
| /projects title | 48px, hardcoded, outside the ramp | 29px `text-h1` | — |
| distinct text colours, home | 12 | 10 | 8 |

- **`--font-hero` and `--font-baskerville` are gone.** #60's hero-only escape hatch existed only
  until the site-wide face was decided; that is this ticket. `--font-display` is now Spectral
  everywhere and nothing references the retired tokens.
- **Colours: 12 to 10.** Three white alphas on dark surfaces (0.8, 0.6, 0.5) collapse to two
  steps: `text-white/75` for muted, `text-white/50` for faint. `TechTag`'s tooltip went
  `text-surface` to `text-white` (250,250,249 and pure white were two census rows for one
  perceived colour). The remaining gap to genesiating's 8 is deliberate: accent-green (#27) and
  diff-add / diff-del (#40), which are content colours, not palette.
- **Two changes the owner added at gate 2, outside the plan.** The hero tagline no longer runs
  #60's staggered colour sweep on load; the `useEffect` is deleted and hover-only colouring (#37)
  is untouched. And `Section`'s padding went `py-24` to `py-16` (96px to 64px, home page 6768px
  to 6385px), picked as variant B from three screenshots of the real page. The spacing follows
  from this ticket: the padding was set against 18px body type and the type shrank under it.

**Worth carrying.**
- **A next/font or `@theme` edit is served STALE by a running dev server.** The Turbopack cache in
  `.next` kept serving `--font-fraunces` through hard reloads, so `--font-display` resolved to an
  empty var and every serif fell back to Geist. `rm -rf .next` and restart. This is the same
  gotcha #60 recorded for `layout.tsx`; it applies to `globals.css` too.
- **The ~375px check never happened.** The Chrome extension's `resize_window` reports success but
  does not change the page viewport, and osascript could not reach the window holding the
  automated tab. Card titles got SMALLER, so `truncate` cannot clip worse than before, but nobody
  looked. The owner accepted at gate 2 having been told exactly that.
- **The 404 counter now renders a synthetic bold.** `NotFoundCounter.tsx:31` asks for
  `font-semibold` (600) and Spectral is loaded at 400 and 500 only. It looks fine; no ticket was
  opened. Fixes are a 600 weight in the font call or `font-medium` at the call site.
- **`Footer.tsx:13` is the social icons, not text.** The plan listed it in the colour collapse, so
  those three icons went 60% to 75% white. It does not move the text census.
- The plan's task 5 said `git rm public/preview-type.html`; git never tracked that file, so it was
  removed with plain `rm` and there is no fifth commit.

### 2026-09-01 — Section headings become 13px Geist labels (#63)

Resolves the ramp inversion #60 left behind, where the 27px hero h1 sat below the 32px section
h2s. The six `text-h2` headings (About "Bio", Timeline, Education, Passions, The Lab, and the
year-group labels on /projects) are now quiet uppercase labels, so card titles at 22px Fraunces
are the loudest type after the hero name.

- **Built twice.** The plan's spec was 12px Geist weight 600 at 0.2em tracking in `ink-subtle`,
  taken from the ticket's Variant B and our own hero-links idiom. The owner rejected it at gate 2
  against a screenshot of genesiating's "GLOBAL" card label and asked for that instead.
- **The plan's premise was wrong.** It cited "genesiating's labels measured 11.99px in the #54
  audit". That 11.99px element is their "SEND ME AN EMAIL" nav item (Monument Grotesk, 0.975rem),
  NOT the GLOBAL card label. The size landed close by luck; the weight and tracking came from our
  hero links and did not resemble the reference at all.
- **The shipped spec, measured live 2026-09-01.** genesiating's GLOBAL label is 1.1rem, weight
  400, letter-spacing a flat 0.4px, line-height 1.2, colour `rgb(183,170,170)`, with the capitals
  typed into the content rather than produced by `text-transform`. Normalised to 1440px that is
  12.83px. Shipped as `--text-h2` = 13px / 1.2 / 0.03em / weight 400, worn with
  `uppercase text-ink-faint` at the call site. CSS `uppercase` was kept so the markup still reads
  "Bio", and `ink-faint` (#a8a29e) was used instead of adding a #b7aaaa token.
- **Normalising is not optional here.** genesiating's root font-size is fluid (20.736px at a
  2560px viewport), so a raw px reading off their site means nothing without a stated width. The
  #54 audit's 1440px is the width used throughout.
- **A contradiction #62 must settle.** #60 recorded their stack as Libre Baskerville (display),
  system sans (body), IBM Plex Mono (labels), read off the live CSS on 2026-08-31. On 2026-09-01
  the live computed `font-family` values read Freight Text (h1 and card titles), Monument Grotesk
  Variable (body) and Golos Text (labels). Both readings are now on #62; the font choice hangs on
  which is right.
- **Verification.** All six headings read 13px Geist w400, ls 0.39px, `rgb(168,162,158)` on home
  and /projects. At 400px wide every label stays on one line with no sideways scroll.
  `npx tsc --noEmit` clean.
- **Untouched:** `--text-h3` (22px Fraunces card titles), `--text-label` (18px item titles),
  every heading margin, and the footer signature h2 (24px Fraunces via `text-2xl`, exempt
  since #58).
- **#62 was widened at this gate** (owner) from a font-face decision to the whole site-wide type
  match: body 18 vs 15.2, card titles 22 vs 16.4, h1 weight 400 vs 200, 17 text colours vs 8, and
  the /projects page title's hardcoded 48px Fraunces that bypasses the ramp tokens entirely.

### 2026-08-31 — Hero type: h1 27px Libre Baskerville, tagline 18, entrance sweep (#60)

Sixth and last build ticket of the #53 feel pass, and it shipped something other than its title:
the owner rewrote the scope at the preview gate. No Bio fold-in, no rectangular portrait,
About.tsx untouched. The hero keeps its layout and round headshot; only the type changed.

- **Scope rewrite at the gate (owner decision).** The plan built six layout variants (A/B/C x
  entrance) around the 2:3 side-crop portrait, then two zoomed-out A variants, then a
  "current format, Genesia exact" rendering, which won: round headshot kept, Bio stays its own
  section, type matched to genesiating.com. The unused `godfrey_portrait.jpg` stays untracked;
  a native portrait photo remains a one-file swap if the layout question ever reopens.
- **h1: 72px Fraunces -> 27px Libre Baskerville.** 27 is genesiating exact (27.25 measured in the
  #54 audit). Libre Baskerville is genesiating's actual serif, pulled off the live site's CSS
  (their stack: Libre Baskerville display, system sans body, IBM Plex Mono labels). Loaded via
  `next/font` as `--font-baskerville`, consumed through a hero-only `--font-hero` token so the
  site-wide display-font decision stays open (#62). `--text-h1` tokens (27px / 1.1 / 0 tracking /
  weight 400) landed in the #58 ramp block. The h1 now sits BELOW the 32px h2s, knowingly; the
  ramp rework is #63.
- **Tagline 24 -> 18px, `text-ink-muted` -> `text-ink-faint`; name-to-tagline gap 24 -> 8px
  (`space-y-6` -> `space-y-2`); links row dropped `md:text-base`** — all matched to the picked
  rendering, not invented.
- **The #37 scramble got a load entrance.** One automatic staggered sweep on mount: per letter at
  `300 + i * 18` ms, inline `transition-duration: 0s` stands in for `:hover`'s snap, a 120ms hold,
  then both inline props removed so the CSS 1s decay takes over. Guarded by
  `prefers-reduced-motion`. Hover behavior unchanged.
- **Verification.** The Chrome extension CONNECTED this ticket (after refusing for #57-#59).
  Computed styles checked (27px/400/Libre Baskerville, tagline 18px faint), hover checked with a
  real mouse move, the entrance proven deterministically: a MutationObserver watched a
  router soft-nav away and back remount the hero and counted 94 style writes across the 47
  letters. Mobile checked in a 400px iframe (media queries track iframe viewports) because
  `resize_window` was refused twice. `tsc --noEmit` clean.
- **Gotcha that cost time:** after editing the `next/font` imports in `layout.tsx`, the running
  dev server kept serving the old `<html>` class list through hard reloads; only a server restart
  picked the new font variable up. Font changes in layout.tsx = restart, don't debug the CSS.
- Follow-ups born at the gate: #62 (site-wide font decision; two serifs coexist until it lands)
  and #63 (ramp rework). The `feel-compare` throwaways are deleted with this docs commit; the
  #53 pass build work is complete.

### 2026-08-31 — Motion: reveals fade opacity only, 0.25s (#59)

Fifth build ticket of the #53 feel pass. Scroll reveals faded in while sliding up 16px over 0.5s;
they now fade alone, over 0.25s. Three lines in one file, and no call site changed. No preview file:
the ticket said the values come off the reference, so it went straight to gate 2.

- **One component, 15 call sites, zero call-site edits.** `Reveal` is the shared scroll-reveal
  wrapper, so its `initial` / `whileInView` / `transition` props are the whole surface. All 15 call
  sites are home page sections: About, Timeline, Education, The Lab, Passions.
- **0.25s, chosen inside the ticket's 0.15 to 0.3s window (plan decision).** The window was measured
  off cmrg.me in the #53 audit; the point inside it was judgment. These reveals fade whole sections
  and multi-element blocks, and at 0.15s a full section reads as a pop rather than a fade. 0.25s sits
  in the upper half, keeps the fade perceptible on large blocks, and halves the old 0.5s.
- **The `delay` prop is kept (plan decision).** Two reasons. Removing it means editing the 8 call
  sites that pass it, across 5 files, against the ticket's one-file constraint. And the staggers are
  not pointless at the shorter duration: the live delays run 0.05s to roughly 0.3s (`ProjectStack`'s
  `0.1 + i * 0.05` over 4+ cards), which still cascades against a 0.25s fade. `Timeline` plumbs
  `delay={delay}` through `TimelineItem`, but none of its five call sites sets it, so Timeline has
  always animated at delay 0 and nothing there changed.
- **Untouched, deliberately:** the easing `[0.2, 0.8, 0.2, 1]` (the ticket asked for opacity and a
  shorter duration, not a new curve), `viewport={{ once: true, amount: 0.2 }}`, the `RevealProps`
  interface, and the reduced-motion branch that returns a plain `div`. No other motion on the site
  moved: the Lab deck stacking, the ScrambleText hero entrance, the stickman, the loss graph and the
  lightbox are all as they were.
- **The slide removal is proven; the duration is not.** With a dev server up, the file was flipped
  back to HEAD and forward again and the served HTML compared: the same 21 elements went from
  `style="opacity:0;transform:translateY(16px)"` to `style="opacity:0"`. That is real evidence, and
  it is the whole of the evidence. A `transition` duration never reaches the server HTML, so
  **whether 0.25s feels right was never checked by anyone**, in a browser or otherwise. The owner
  accepted at gate 2 having been told exactly that. If the fade ever reads as a pop, 0.3s is the
  other end of the sanctioned window and it is a one-number edit.
- **The Chrome extension would not connect, for the third ticket running** (#57, #58, #59). This is
  now the normal case here, not a surprise. Unlike #56 and #57 there was no headless-Chrome fallback
  either, because headless does not fire `requestAnimationFrame` and so cannot judge a Framer
  transition any better than a hidden tab can.
- **The plan was wrong about /projects.** Its step 2 said to watch rows fade in there. `/projects`
  renders `ProjectsIndex`, which imports no `Reveal` at all, and its served HTML carries no
  `opacity:0` elements. Nothing to fix; the check simply did not exist.

### 2026-08-31 — Type ramp: one size per tier below the h1 (#58)

Fourth build ticket of the #53 feel pass. Section headings ran `text-2xl` to `text-4xl` with mixed
tracking, and the h2 tracking dropped to `normal` on `/projects`. Four tiers are now defined once in
`globals.css` and consumed as utility classes. 42 insertions, 26 deletions across 10 files.

- **The owner picked B (32 / 22 / 18), from three previews.** `public/preview-type.html` showed the
  same four specimens three times: a section heading, a card title, a minor title and a paragraph. A
  was 36/24/20 (the ticket's own example), C was 40/26/20. B is the quiet ramp: every current desktop
  h2 shrinks slightly. The owner picked it knowing the flagged consequence, that **the label tier
  lands at 18px, the same size as body** — only weight 600 and line-height 1.10 separate the two.
  Timeline role names are where that reads hardest.
- **Four `--text-*` tokens, not per-component classes** (the ticket's "prefer tokens" constraint, so
  the hero ticket can reuse them). Tailwind v4 generates `text-h2`, `text-h3` and `text-label`
  carrying size, line-height, letter-spacing and weight together; `text-body` carries size and
  line-height only, no weight. Font family stays a separate class, so `font-display` still marks
  where Fraunces applies.
- **Two sub-tiers below h2, not one (gate-1 decision 1).** The "every h3 the same" line was read per
  role. Card titles — the three Passions cards, every project card, the GitHub tile — take the h3
  tier in Fraunces. Minor titles — Timeline roles, Education degrees, `/projects` row titles — take
  the smaller label tier in Geist 600, and the row titles **drop `font-display`** to get there.
- **`ProjectCard`'s h3 lost its three-way size ternary and its mobile step-down.** It was
  `stack ? text-3xl : featured ? text-3xl md:text-4xl : text-2xl` plus `max-sm:text-xl`; it is now
  one plain string. The featured card's title visibly shrinks from 30-36px to 22px, which is the
  flattening the ticket asked for. `stack` and `featured` both stay, still driving layout in five
  places each in that file.
- **Body is prose only, fixed 18px/1.625 with no responsive split (decision 2).** About paragraphs,
  project descriptions on both surfaces, the Timeline bullets, and the sublines under The Lab and the
  `/projects` h1. The 14px `text-sm` support text inside the Passions and Education cards stays put:
  that is a caption role, not body. Density did not change.
- **The footer h2 is exempt and became a link (decision 3, owner-added scope).** It is a signature,
  not a section heading, so it keeps 24px Fraunces. The name now wraps in `<a href="#top">`. There is
  no `id="top"` anywhere, which is correct: the HTML spec makes `#top` mean the document top, and
  `html { scroll-behavior: smooth }` was already in `globals.css`, so no other file changed.
- **Tracking normalized on the three heading tiers (decision 4).** -0.025em, the value cmrg uses at
  every heading size. The 12px uppercase meta labels keep positive tracking, and the one straggler
  (`tracking-wide` on "Built with") moved to `tracking-wider` so every meta label matches.
- **Untouched, deliberately (decision 5):** the hero h1 and tagline, the `/projects` h1 and its
  `tracking-tight` (the h1 tier belongs to the hero ticket, #60), the 10px construction banner, the
  mono "Drafting system…" line and the streak number.
- **Verification did not use the browser.** The Chrome extension would not connect, on two tries, and
  the session stopped retrying rather than burn the window. Verification came from the
  server-rendered HTML plus the generated CSS instead: every h2 on both pages resolves to the same
  class list, as does every card title and every minor title, and the four utilities were read out of
  the dev CSS bundle to confirm they carry the intended size, leading, tracking and weight. Two
  elements only render once a `/projects` row is opened, so they never appear in server HTML and were
  checked in source only: the expanded description (`text-body`) and the "Built with" label. **Nobody
  looked at the rendered page**; the owner accepted at gate 2 having been told so. `npx tsc --noEmit`
  exited 0.

### 2026-08-30 — Palette: one neutral chip style, Nunito Sans dropped (#57)

Third build ticket of the #53 feel pass. The audit blamed tinted chips for the site's background
count; the measurement taken while planning showed chips were only 5 of home's 20 distinct
backgrounds, so the ticket's "4 or fewer" line was ruled out at gate 1 and replaced with 15.
15 insertions, 49 deletions across 7 files.

- **The owner picked A (outline), from three previews.** `public/preview-chips.html` showed the same
  markup three times: a status pill on a Lab card, a row of "Built with" tech chips, and the 40px
  `/projects` tile with and without a logo. A is `border border-rule text-ink-subtle` with no fill;
  B (soft fill) and C (inverted) lost. Because A is an outline, every chip and tile on both pages now
  has NO background at all, which is why `/projects` counts 0 distinct backgrounds and not the 2 the
  plan predicted: the one grey box left there (`bg-surface-sunken` behind an open row's media) only
  exists while a row is open, and the counter never opens a row.
- **`tone` is gone, not just retuned.** `BadgeTone`, the five-entry `toneStyles` map and the `tone`
  prop were deleted, because after the tints came out no tone changed anything — the
  under-construction banner keys off `status === "building"` in `ProjectCard`, not off `Badge`, and
  there is no live dot in the codebase. `Badge` is now `{ children, className?, tabIndex? }` and one
  class string. `Project.status` got its own `ProjectStatus` union, so `lib/projects.ts` no longer
  imports from a UI component.
- **The `color` field and all 11 values are out of the data.** Violet, rose, green, orange, sky,
  amber, cyan, blue, indigo, red and emerald. Rows with no logo (7 of 11 projects) keep their 40px
  square, now an empty outlined one: removing it would shift the title column on those rows, which
  is structure, and this ticket is palette only.
- **The Lab card media pane did NOT take the picked style (plan decision 3).** `ProjectCard` put the
  project tint on the 55%-wide pane behind the carousel, not on a small tile. Painting a 55% pane to
  match a chip would have been a surprise, so it took `bg-surface-sunken`, the same inset fill the
  `/projects` media box already uses. All four featured projects have media, so the pane is invisible
  today either way.
- **The `/projects` tech chip kept its accent hover.** `hover:border-accent focus-visible:border-accent`
  only means something for an outline chip, so A is the one variant that keeps it. Verified live: the
  hovered chip's computed `borderColor` reads `rgb(194, 65, 12)`.
- **Nunito Sans is out.** The font, its `--font-nunito-sans` variable, the `--font-streak` token and
  the `font-streak` class are deleted, so the GitHub streak number falls through to Geist. Its
  computed family reads `Geist, "Geist Fallback", ...` at weight 800 with `tabular-nums`; weight and
  tracking were not touched, and the browser made zero requests for Nunito. The count-up animation
  (#22) could not be exercised: it runs on `requestAnimationFrame`, which does not fire in headless
  Chrome, and the extension was not connected. The diff touches two comment lines and one class name
  in that file and nothing in `play`.
- **Backgrounds, measured the audit's way** (1440 wide, every element inside `main`, transparent
  excluded): home **20 to 15**, `/projects` **11 to 0**. Of home's remaining 15, five are Heatmap
  contribution cells (data, like the footer diff colours) and ten are neutral fills the design already
  used, four of them alpha variants the counter sees as distinct. Reaching the ticket's 4 means ruling
  on the Heatmap and the alpha fills, neither of which is a chip; that is a new ticket, not this one.

### 2026-08-30 — Cards: 0px radius, no shadow, no border, equal Passions heights (#56)

Second build ticket of the #53 feel pass, and the first one a visitor can see. The audit ranked
radius first: 13 elements sat at 24px while neither reference site goes above 4px and `/projects`
itself already used 0 and 4. 11 lines across 5 files, radius and elevation only.

- **The owner picked 0px, not the 4px in the ticket title.** `public/preview-cards.html` showed the
  same markup three times with `--r` at 0, 4 and 8 on a Lab card, the whole Passions row and a grid
  card, every block already stripped of border and shadow. A won, so `{R}` resolved to
  `rounded-none` everywhere, and the ticket title (written before the preview existed) is the only
  place 4px survives.
- **Six card surfaces went square and flat.** The Lab deck card and its veil, the GitHub tile, the
  grid project card and the three Passions cards dropped `rounded-xl`; `border border-rule`,
  `shadow-lift`, `hover:shadow-lift`, `ring-1 ring-white/60` and `shadow-soft` came off the cards.
  The grid variant's bare `transition` went with them: once both hover classes were gone it
  animated nothing, so it was an orphan the change created, not adjacent cleanup.
- **Decision 3 split the two 8px boxes, and both halves shipped.** The ProjectCard details drawer
  KEPT `border border-rule`: it is a popover (`absolute bottom-full ... w-72`) floating over a card,
  and a `bg-surface-sunken` panel with no border and no shadow has no edge at all. The `/projects`
  expanded-row media box DROPPED its border, because an inline frame in the row follows the cards.
  Both are one class each if the call turns out wrong.
- **Passions is three equal columns.** The grid went `md:grid-cols-2` to `md:grid-cols-3` and the
  soccer card lost `md:row-span-2`. Every card already carried `md:h-auto`, so all three stretch to
  the grid's existing `md:h-[500px]`. Measured: 288 x 500, 288 x 500, 288 x 500. The 500 was already
  in the code; no new number was invented. Mobile still stacks at `h-[300px]`. The soccer card's
  `ring-2 ring-accent/40` highlight flash and its `transition-shadow duration-500` stayed, because
  that is the `highlight-soccer` behaviour from About, not elevation.
- **Two tokens died.** Nothing referenced `--radius-xl` or `--shadow-soft` afterwards, so both left
  `app/globals.css` and the header comment's radius list lost `xl (24)`. `--radius-lg` stays for
  MediaLightbox. `--shadow-lift` stays for the hero avatar, the About tooltip and MediaLightbox.
  `--shadow-lid` (#39, the page over the pinned footer) was never in scope.
- **What is still round, all of it deliberate.** Measured on home after the change: the Education
  rows and The Lab CTA at `rounded-md`, the chips, project logos, links and About tooltips at
  `rounded-sm`, the 365 Heatmap cells at 2px, and every `rounded-full`. All were on the plan's
  untouched list. The hero avatar kept its `shadow-lift` and belongs to the hero ticket.
- **The cost, accepted at gate 2.** A white card on the `#fafaf9` page now has no visible edge; the
  deck reads as content floating on the page rather than as stacked cards. That is what the ticket
  asked for. #57 (palette) may resolve it without another radius change.
- **Two process notes.** The code was written on 2026-08-28 by a session that stopped before it
  deleted the preview or looked at the running site; the 2026-08-30 session found it uncommitted on
  main, finished Task 2 steps 7 to 9, verified, and wrote none of the code. And the Chrome extension
  was not connected that day, so verification ran through headless Chrome over CDP
  (`--headless=new --remote-debugging-port=9222`, `Emulation.setDeviceMetricsOverride`,
  `Runtime.evaluate`, `Page.captureScreenshot`) at 1440x900 and again at 600x900 for the grid
  variant. That is the fallback STATE.md's gotchas already name, and it is more reliable for exact
  viewports than the extension.
- **Opened from this gate.** #61: `ProjectCard.tsx:82` ships `Under construction · Under
  construction · Under construction`, three middle dots in shipped copy, pre-existing and
  explicitly out of scope in the #56 plan.

### 2026-08-26 — Prefactor: one 960px column, one section rhythm (#55)

First build ticket of the #53 feel pass, and the reason the rest of the pass is cheap: once every
home section shares a wrapper, the radius, type, palette, motion and hero tickets each edit one
file instead of six. Layout only, 14 lines changed across 7 files, no radius, colour, type, motion
or copy touched.

- **`Section` is the only wrapper.** It lost the `width` prop and the `narrow` / `wide` split, and
  hard-codes `w-full max-w-[960px] mx-auto px-6 py-24`. Its props are now `id`, `className`,
  `children`. Later tickets in the pass edit that one class string. `max-w-[960px]` is an arbitrary
  value on purpose: no Tailwind token equals 960px, and `ProjectsIndex` already uses the same class.
- **Six callers, all wrapper lines.** Hero and Passions stopped hand-rolling their own `<section>`
  (they were `max-w-5xl` and `max-w-6xl`). About dropped its outer `<section>` and returns a
  fragment, so the 1px gradient rule stays a full-bleed sibling of the `Section` instead of being
  capped at 912px. Timeline (`pb-8 pt-24`), Education (`py-8`) and The Lab (`width="wide" py-24`)
  stopped passing padding and width. `<section>` count inside `<main>` went 7 to 6.
- **Padding, not gap — the one interpretation call.** The ticket's Done-when asked for 96px
  between adjacent sections "measured the way the audit measured it", but the audit measured
  section BOXES, and boxes that stack with padding touch. So the rhythm shipped as a 96/96 padding
  pair on every section: computed `padding-top` and `padding-bottom` both read `96px`, box gaps
  read 0 between direct neighbours. A gap model would need margins or flex-gap, and vertical
  margins collapse through the lid wrappers in `app/page.tsx`. Owner accepted padding at gate 2
  after seeing it against the 48px alternative.
- **The three interstitials are not sections and did not move.** About's 1px rule, `StickmanRunner`
  (140px) and `LossGraph` (288px) stay full-bleed siblings between section boxes; moving them
  inside a `Section` would have shrunk them to 912px. Measured box gaps: 1, 140, 0, 288, 0.
- **The Lab deck kept `max-w-[900px]`.** `ProjectStack.tsx` has zero diff: cards stay 900x440,
  `gap-[10vh]`, `md:sticky` and the `top: calc(7vh + index*12px)` offsets all untouched inside the
  new 912px content box. Side effect the owner saw and accepted: The Lab heading's left edge now
  sits 6px left of the deck's left edge, where it was 102px before. Dropping the 900 cap is a
  one-class change in `ProjectStack.tsx`, deliberately out of scope.
- **What moved visibly at 1440**, measured text to text: hero top 128 to 96; hero to Bio 97 to 194;
  Bio to Work 333; Work to Education 64 to 177; Education to The Lab 497; The Lab to Passions 204.
  Content boxes for The Lab and Passions went 1104 to 912 wide, so each Passions card went 540 to
  444 (heights unchanged, the `md:h-[500px]` grid holds). Page height at 1440 is 6792px.
- **Verification ran on headless Chrome, not the extension.** The extension's tab renders in an
  offscreen surface at a fixed 1872x862 viewport, reports `visibilityState: "hidden"` and
  `outerWidth: 0`, and ignores `resize_window` — activating the tab with `osascript` did not fix it
  this time. The audit-width measurement was taken with the same CDP script recipe #54 used
  (`Emulation.setDeviceMetricsOverride` to 1440x757, then `Runtime.evaluate`), scripts in the
  scratchpad, never committed. `npx tsc --noEmit` clean.
- **Gate-2 aid, thrown away.** To settle padding vs gap the builder captured the same 560px band
  at every section join twice, once at `py-24` and once at `py-12`, and put them side by side in a
  scratchpad HTML opened over `file://`. Every join came out exactly 96px tighter at `py-12`, and
  the whole page 576px shorter. Nothing entered `public/` and the working tree was restored to
  `py-24` before the commit.

### 2026-08-26 — Comparison page: site vs cmrg vs genesiating (#54)

First deliverable of the #53 feel pass (its decision 2): put the audit's numbers next to real
pictures so the gap is seen in pixels before any variant is drawn. **Throwaway.** `public/feel-compare.html`
and `public/feel-compare/` are deleted in the docs commit that closes the last ticket of the pass.
Nothing in the site's real components changed; the whole diff is one HTML file and nine PNGs.

- **Nine shots, one recipe.** A ~60-line Node script (scratchpad only, never committed) drove
  headless Chrome over the DevTools protocol using Node 24's built-in `fetch` and `WebSocket`, so
  no dependency was added. Every site got the same three shots at a 1440x757 viewport: the hero at
  scroll 0, one mid-page section scrolled so its heading sits 96px below the top, and one card
  clipped to its bounding box at `scale: 2`. The CDP `clip` is in PAGE coordinates
  (`getBoundingClientRect()` plus the scroll offset), not viewport coordinates.
- **What each column shows.** Site: hero, Work Experience timeline, the first Lab card
  (CometAdvisor, 900x440, the 24px radius the pass is about). cmrg: hero, the "recently written"
  blog grid, the first blog card (347x128). genesiating: hero, the logo wall plus speaking list,
  the Watsi charity card (330x305).
- **`www.cmrg.me`, not the apex.** `https://cmrg.me` times out from this machine in both curl and
  Chrome; `https://www.cmrg.me` answers 200 and serves the same page the audit measured.
- **The outlier rule, and a plan error.** A cell is shaded when the site's value falls outside the
  range spanned by the two references. The plan's prose said that marks 10 of 13 rows and its Step 6
  check said "exactly 10", but the plan's own table markup and its own legend mark 11. Checked row by
  row against the rule, 11 is right: only small label size (12 sits between 11.99 and 15.5) and
  distinct text colours (17 sits between 8 and 20) put the site inside the range. The body row is
  shaded for its SIZE (18 against 14.17 and 15.5) even though its line-height 1.625 sits between the
  references. 11 shipped; the "10" was a planning slip, not a build deviation.
- **Files, not data URIs.** 2.8MB across nine PNGs, referenced by relative path so the page resolves
  under both `localhost:3000` and `file://`. Verified both ways: the dev server render (9 images,
  0 broken, 13 rows, all 11 shaded cells in the godfreyponce.dev column, clicking a hero opens the
  1440x757 PNG) and a headless `file://` screenshot.
- **Settle times are guesses that held.** 2500ms after load and after each scroll was enough for the
  site's 69 scroll-reveal elements, cmrg's opacity ramp and genesiating's lazy images. No shot came
  back with blank regions, so no reshoot was needed.

### 2026-08-26 — Two-finger swipe and touch drag paging in the /projects overlay (#51)

Follows #52. The overlay paged only by arrows, keys, and the scrim. Now a trackpad swipe or a
finger drag anywhere on it pages one slide, on the carousel's own thresholds. Two files: four
`export` keywords in `MediaCarousel.tsx` and a gesture layer in `MediaLightbox.tsx`.

- **The gesture surface is the dialog root.** It became a `motion.div` with `touch-none`,
  `onPanStart`, `onPanEnd`, and a native `wheel` listener. The root already owned the keys and
  the backdrop click and covers the whole screen on a phone, so a thumb anywhere pages; a swipe
  over the title bar or the scrim paging is intended. Moving it to the stage only is: move the
  `ref`, the two pan props, and `touch-none` to the stage `div`.
- **The thresholds are the carousel's, imported.** `SWIPE_POWER`, `SWIPE_DISTANCE`,
  `WHEEL_FIRE_PX`, `WHEEL_QUIET_MS` went from `const` to `export const`; that is the whole
  carousel diff. The wheel path is the same accumulate, fire once, lock until quiet pattern, so
  one macOS momentum burst is one slide. It is a native listener with `{ passive: false }`
  because React's `onWheel` is passive and `preventDefault` (what stops the browser back-swipe)
  would be ignored. A vertical wheel (`|deltaY| >= |deltaX|`) is left alone and not prevented,
  so page scroll still belongs to the page.
- **The pan flips on release and never follows the finger** (owner decision). No `drag`, no
  motion value: `onPanEnd` reads `offset` and `velocity` off the `PanInfo` and applies the
  carousel's power-or-distance test. A pan whose `|offset.y| >= |offset.x|` does nothing.
  Verified at gate 2: dialog, stage, and img all `transform: none` after each drag.
- **The backdrop-close guard.** A pan released over the scrim fires `click` on the dialog root
  (the common ancestor of the down and up targets), which `e.target === e.currentTarget` would
  read as a scrim click. A `panned` ref, set on `onPanStart` and cleared a tick after settle,
  is the carousel's `dragged` trick. Verified: drag from the image out to x=80 on the scrim
  landed `pointerup@80 click@80`, the overlay stayed open and paged; a plain click at the same
  spot then closed it.
- **`touch-none` costs pinch-zoom while the overlay is open.** If that is wanted back, the
  class is `touch-pinch-zoom` (Tailwind v4): still blocks single-finger panning, which is all
  the pan session needs.
- **Verified under automation, two sessions.** Wheel on Nudge, 150 px `deltaX` per burst:
  `1/3 -> 2/3`, `2/3 -> 1/3`, `1/3 -> 1/3` (clamped), vertical `deltaY: 120` unchanged and not
  prevented. Drag 300 px with the mouse at 1:1 scale: left `1/3 -> 2/3`, right `2/3 -> 1/3`,
  arrows tracking the ends. TechAssist slide 4: Next x3 renders the YouTube iframe at
  1000x490, ArrowLeft pages off it, Next brings it back, Previous pages off again. Homepage
  TechAssist card still pages one slide on the same burst and opens no overlay. Console clean.
- **Gotcha: the automation tab must be the ACTIVE tab of its Chrome window.** Two sessions were
  lost to `document.visibilityState === "hidden"` with zero animation frames, which kills
  Framer's pan session AND `AnimatePresence` (the crossfade never finishes, so the incoming slide
  never mounts: counter `4 / 4` with no iframe). Raising the window, signing in, and creating a
  fresh tab group all did nothing, because the extension's tab sat at index 3 while index 1
  ("New Tab") was active. `outerWidth`/`outerHeight` read 0 in that state. The fix from the
  terminal: `osascript -e 'tell application "Google Chrome" to set active tab index of window 1
  to N'`, then gate every animated check on `visibilityState === "visible"` and one
  `requestAnimationFrame` actually firing.
- **Plan defect, script only:** step 3b read the counter in the same tick it dispatched the
  wheel events, before React re-rendered, so it always returned the old value. Dispatch and read
  must be two calls.
- **Left to the owner:** real trackpad momentum timing and a real finger (automation has no
  touch emulation), the iOS/Android edge back-swipe (an OS gesture no web content can suppress;
  drags that start on the overlay's content are covered), a swipe starting on the YouTube
  player (the iframe swallows it; arrows and keys still page off it, which is the criterion),
  and Reduce Motion at runtime (no `reduced` branch in the wheel or pan paths by reading the
  code; toggle it THEN reload).

### 2026-08-25 — Overlay opens instantly: cached layer, silent sharpen, neighbour preload (#52)

Follows #49. The `/projects` overlay used to mount one `next/image` at the overlay's own `sizes`,
which is a different URL from the one the carousel had already fetched, so the stage was blank
until that second render arrived. Two files, one `export` keyword and a new module-private
`ImageStage`.

- **The stage is two layers in one `fill object-contain` box.** The bottom layer repeats the
  carousel's exact request: same `src`, same `quality={90}`, and the carousel's own `sizes` string,
  now imported as `CAROUSEL_SIZES`. Same URL means the browser already has the decoded picture. The
  top layer is the 1100px render, wrapped in a `motion.div` at `initial={false}` and
  `animate={{ opacity: sharp ? 1 : 0 }}`, flipped by the image's `onLoad`. Both layers are `fill`
  in the same box, so the sharpen cannot shift layout. Measured at gate 2: the stage rect was
  `x 203, y 114.95, w 1058, h 508.09` before the sharpen and byte-identical after.
- **The `sizes` string is imported, not copied.** `MediaCarousel.tsx:25` went from `const` to
  `export const IMAGE_SIZES`. This is the whole carousel diff. Two modules now form an import cycle
  (`MediaCarousel` imports `MediaLightbox` as a value; `MediaLightbox` now imports a real value
  back), which is safe only because neither reads the other's export at module top level. Do not
  hoist `CAROUSEL_SIZES` into a module-level expression.
- **Neighbours are preloaded with real `<img>` elements, not hand-built URLs.** The candidate the
  browser picks depends on viewport and DPR, so only the browser's own pick is guaranteed to match
  what the stage will later ask for. A rolling window of `[index - 1, index + 1]`, clamped at both
  ends, rendered `loading="eager"`, `fetchPriority="low"`, `opacity-0` and `pointer-events-none`.
  Verified: `nudge-stack.png` at the large width cost 79,929 bytes / 274 ms when preloaded, then
  300 bytes / 8 ms when actually paged to.
- **The preload skips YouTube items** with the same test the stage uses
  (`item.type === "youtube" && item.videoId`), so the two can never disagree about which items are
  images. Confirmed on TechAssist slide 4: the iframe renders as before and the preload block emits
  only `techassist-search.jpg`, never an `<img>` for the video.
- **Gotcha, dev only: the cached layer still issues one request in dev.** The plan predicted none.
  Dev's optimizer sends `Cache-Control: public, max-age=0, must-revalidate`, so Chrome revalidates:
  300 bytes of headers, no image body, 6 ms. Production sends `max-age=14400` (the
  `minimumCacheTTL` default), so there is no request there. Do not read a `_next/image` line in the
  dev network panel as a cache miss; check `transferSize` in Resource Timing instead.
- **Known, not changed:** the bottom layer keeps `next/image`'s default `loading="lazy"`. Only the
  preloads are `eager`. It works because the stage is in the viewport at mount, but `eager` on that
  layer would be the stronger first-frame guarantee if this ever looks slow.
- **Left to the owner:** the throttled (Fast 3G) first-frame check. Browser automation has no
  network throttle, so the build proved the mechanism (identical URL, no body re-downloaded, image
  present) and the owner runs the real measure on godfreyponce.dev.

### 2026-08-25 — Two em dashes out of the shipped project descriptions (#50)

Copy only, two `description` lines in `lib/projects.ts`, no component touched. Both predated the
no-em-dash rule (owner rule 2026-07-17) and #45 had scoped them out, so #50 was opened from that
build to finish the job.

- **The owner wrote the replacements; the build did not guess them.** The ticket said so
  explicitly, because a rewrite around a removed dash changes the meaning. Both lines came back
  from the owner at the gate:
  - CometAdvisor: `...get a personalized semester plan like “what to take”, “who to take it with”, and why.`
  - Remix: `...builds a personalized interview around them, basically so you can practice what actually matters.`
- **The quotes are curly** (U+201C/U+201D), picked over straight `"` at the gate. That made the
  real check a rendering check, not a diff check: a mis-encoded curly quote is invisible in `git
  diff` and shows as mojibake on the page. Read back off the rendered row at
  localhost:3000/projects, clean.
- **`description` has exactly one render site**, `ProjectsIndex.tsx:33` (destructured for the
  expanded row). The collapsed row and the homepage Lab card both use `shortDesc`. So the expanded
  /projects row is the entire verification surface for a `description` edit — worth knowing before
  spinning up a homepage check that proves nothing.
- Cosmetic, flagged and accepted: at desktop width the second quoted phrase wraps, so a line starts
  with `take”,`.
- Gate: `grep -n "—\|·" lib/projects.ts` returns nothing (the ticket's own check), `tsc --noEmit`
  clean.

### 2026-08-25 — Images, stacks, and dates for the seven new projects (#45)

Data entry only: no component touched. Seven entries had `tags: []`, no `date`, and no `media`,
so after #46 and #49 made the carousel and the chips the centre of the expanded row, those rows
had nothing to show. Four projects got carousels, all seven got a stack and a date.

- **Eleven images under `public/projects/<lowercase-name>/`**, following the existing convention
  (`<name>Logo.*` hero first, `<name>.png` screenshot second, a third named for what it shows).
  Nothing tripped the ~2800px / 1MB resize bound, so `sips -Z` never ran. Two files were
  transformed instead: the Power Automate screenshot was cropped `1060:678:560:0` (2170x678 332K
  to 1060x678 120K) and frame 24 of jiraPlane's `flight.gif` was extracted as a still (9.0MB
  animated gif to 560x315 212K). Both with `ffmpeg`.
- **The crop is centred, not left.** The intake said "crop to left ~60%", but the two flow steps
  sit at x 960 to 1330 of 2170, so a left-60% crop would clip them. The centre crop keeps both
  steps plus the header.
- **TechAssist keeps its video by putting it IN the `media` array.** `rowMedia()`
  (`ProjectsIndex.tsx:22-27`) and `ProjectCard.tsx:87-89` both use `media` when it is non-empty
  and fall back to `videoUrl` only when it is not, so "stills plus keeps the video" needs a
  `{ type: "youtube", src: "", videoId }` slide. The fallback builds that exact object, so the
  player is unchanged. Consequence, accepted at gate 2: TechAssist is `featured`, so the
  **homepage** Lab card is now a 4-slide carousel opening on the QR scan photo instead of a bare
  embed.
- **jiraPlane gets two slides, not three.** `hero.svg` is the same picture as
  `social-preview.png`, and `magick` cannot rasterise it here (its text needs a font the delegate
  cannot find). The gif frame is 560x315 in an 838px row, so it upscales ~1.5x and reads soft;
  the real fix is a phone-video still exported later.
- **Portrait and wide slides use `fit: "contain"`**, which paints a blurred copy of the image
  behind the contained one (`MediaCarousel.tsx:175-195`). That answers the intake's "portrait on a
  colour block" question with the component as it already stands.
- **Five chips per row is fine.** The widest new chip, "Jira Data Center API", measures 132px, so
  five wrap onto two lines inside a 375px-wide column with nothing overflowing.
- **Nine hackathon `alt` strings lost their em dashes** (`CometAdvisor — Logo` became
  `CometAdvisor logo`, and so on). Deferred here by the #49 plan. `alt` is shipped copy: screen
  readers read it and `MediaCarousel` puts it in the "Open ... in a larger view" aria-label. Two
  em dashes remain in CometAdvisor's and Remix's `description` strings; they were scoped out and
  captured as #50. Nudge's description uses an ellipsis, not a dash, so it is two lines, not the
  three the plan predicted.

Two plan predictions were wrong and neither needed a code change. Rows with no `media` do not keep
a placeholder block, they go full width (that is #46's split-row behaviour). And inside "Every day"
the order is kal, Debrief, glass, not kal, glass, Debrief: Debrief and glass are both May 2026, so
the tie falls to array order. Not verified in the automation tab: the YouTube slide starting on
click (same code path as before, so nothing changed) and a true 375px viewport, since Chrome
refused the window resize and the body-width workaround does not trigger the mobile layout.
`npx tsc --noEmit` clean.

### 2026-08-25 — Click a screenshot to open it in a slideshow overlay (#49)

Owner picked variant B ("Gallery card") from three previews of the overlay. #46 shrank the media
frame on purpose so it would stop dominating the expanded row, which left the screenshots too
small to read and, because `MediaCarousel` had no click target at all, no way to see one bigger.

- **New `components/ui/MediaLightbox.tsx`.** Portals to `document.body`. A `surface-raised` panel
  (`min(1100px, 92vw)`, `max-h-[90vh]`, `rounded-lg border-rule shadow-lift`) on an `ink/60`
  blurred scrim, image on a `surface-sunken` stage (`56vh`, `sm:70vh`) with `object-contain`, and
  a footer bar under a top rule holding the project title left and a `1 / 3` counter right.
  Arrows sit on the stage edges rather than the panel edges, so no magic offset is needed to keep
  them off the footer. `CarouselArrow` could not be reused as a component: its
  `opacity-0 group-hover/carousel:opacity-100` pair hangs off the carousel's group class, which
  does not exist inside the overlay, so the chrome is copied and visible by default.
- **`expandable` is opt-in, so the homepage is untouched.** `MediaCarousel` takes the new prop and
  `ProjectsIndex` passes it; `ProjectCard` does not, and the homepage still renders three
  carousels with zero open-larger buttons. The carousel owns the overlay's open index, which makes
  "the row lands on the slide the overlay was left on" a plain internal `snap(closeIndex)` on
  close with no controlled-component plumbing in `ProjectRow`.
- **Portal events bubble through the React tree, not the DOM tree.** The plan called the overlay's
  placement in the JSX cosmetic because it portals out anyway. It is not: rendered inside the
  carousel's root `<div>`, the overlay's Left/Right keys also reached that div's `onKeyDown` and
  paged the row behind the scrim. The carousel's handler now bails while the overlay is open.
- **Focus returns synchronously, not in a `requestAnimationFrame`.** Every slide stays mounted, so
  the button to focus already exists and there is nothing to wait for; deferring a frame stranded
  focus on `<body>` in a hidden tab, where rAF never fires. Focus lands on the slide the carousel
  shows after the close snap, not always the clicked one: if the visitor paged inside the overlay,
  the clicked slide is by then `aria-hidden` with `tabIndex -1`, and focusing an aria-hidden
  element is an accessibility bug.
- **Swipe must not open the overlay.** A `dragged` ref is set on `onDragStart` (plus `onPanStart`
  in reduced mode, where drag is off and the carousel settles via `onPanEnd`) and cleared in a
  `setTimeout(…, 0)` at the end of `settle`, so the click the browser dispatches after `pointerup`
  still sees it. This is the one behaviour that could not be verified in the automation tab (see
  the gotcha in STATE.md) and was handed to the owner.
- **YouTube slides get no open-larger button** (decided in the plan, not guessed at build time):
  clicks over an embed land inside the iframe and cannot be intercepted without breaking playback.
  Paging inside the overlay still reaches a video slide and renders it as a bigger embed, so the
  carousel and overlay indices stay 1:1 with no remapping. No project mixes images with a video
  today — TechAssist is video-only, via `videoUrl` — so that branch was exercised by temporarily
  adding a video slide to CometAdvisor's `media`, then restoring the file.
- **Motion is opacity only, never transform**, with `duration: 0` under `prefers-reduced-motion`,
  so the reduced-motion rule is met by zeroing a duration rather than by a second code path.

Verified at 375px (panel 343 wide) and 1280px (panel 1100 wide): no horizontal scroll, image
inside its box at both. `npx tsc --noEmit` clean.

### 2026-08-24 — Expanded /projects row split in two, chips answer the cursor (#46)

Owner picked variant A ("Split") from three previews of the opened row. The complaint was that
the expanded body stacked unrelated blocks: a full-width 3:2 carousel, then the description on
the left with chips and links crowded to the right, and the chips themselves (13px icon at 75%
opacity, no hover) read as a footnote rather than as the one place the site names its stack.

- **Two columns instead of a stack.** Media sits left at `sm:w-[55%]`, aspect unchanged at 3:2;
  the text column takes the rest and holds description, a `Built with` label over the chips, and
  the links row pushed to the bottom with `mt-auto`. Under `sm` the whole thing is one column with
  the media on top. Shrinking the frame by column width rather than by aspect is what stopped it
  dominating the row, and it keeps `MediaCarousel` (#47/#48's territory) untouched: the frame
  stays `relative` with an explicit aspect ratio and the carousel fills it.
- **Chips are now interactive, visually only.** `tabIndex={0}` plus `hover:`/`focus-visible:`
  border-accent and text-ink, icon opacity .75 to 1, and a 2px lift. No tooltip, no link (decided
  2026-08-21) — `TechTag` was precedent for the treatment, not something to reuse, because its
  tooltip is banned here. `Badge` grew an optional `tabIndex` passthrough onto its span.
- **Reduced motion is structural, not a second code path.** Every transform and transition is
  behind `motion-safe:`, which Tailwind v4 compiles to a real nested
  `@media (prefers-reduced-motion: no-preference) { @media (hover: hover) { ... } }`, while
  `hover:border-accent` and `hover:text-ink` sit outside it. Under reduce the colour and border
  still change, instantly, with no lift — verified by reading the served stylesheet rather than by
  emulating the setting, which the extension cannot do.
- **The plan missed an empty-state guard and it was a real defect.** Variant A introduces a
  standalone `Built with` label, and seven projects carry `tags: []`; `clawd` rendered a dangling
  `BUILT WITH` heading over nothing. Wrapped in `tags.length > 0`. The plan had written the
  matching guard for `media.length > 0` and simply did not generalize it: a variant that adds a
  *label* inherits an empty-state the previous layout never had.

Verification at 1280px: media 462px, text column 649px, split direction `row`. At 375px (injected
same-origin iframe, since `resize_window` refuses a fullscreen window): `scrollWidth` 375 against a
375 viewport, direction `column`, chips wrap to two rows. Chip hover reads border `#c2410c`, text
`#1c1917`, `translate: 0px -2px`, icon opacity 1, and reverts fully on mouse-out; a real Tab reached
the Gemini chip with the same three changes plus the ring at `outline-offset: 2px`. `clawd`
(no media, no tags) renders description then GitHub with no hole. `npx tsc --noEmit` clean, exit 0.

Note for the next automation session: `getComputedStyle` read straight after a `hover` action
returns the transition's t=0 values while `matches(':hover')` is already true — the existing
gotcha, hit again here. Sleep past the duration before reading. And Tailwind v4 puts translate
utilities on the `translate` property, not `transform`, so a lift reads as `transform: none` and
looks absent unless you read `translate`.

### 2026-08-24 — Peek removed: slides fill the frame again (#48)

Question ticket, answered by discarding both of its options. #48 asked whether the peek should
centre its active slide (`w-[88%]` → `w-full`, 50/139 gutters → 50/50). The answer is neither:
the peek came out entirely.

- **The measurements on #48 were taken on the wrong surface.** Both #47's variant preview and
  #48's table used `/projects`, where the carousel box is 838px and a peek has room. The other
  caller is the homepage Lab card, where `ProjectCard` puts the media in a `md:w-1/2` column and
  the carousel is **494px**. There the same 6% padding plus a 12% slide reduction leaves an ~82px
  vertical slab of the next screenshot pressed against the text column, with the next-slide arrow
  floating on top of it. It reads as a broken image, not as an invitation to swipe. Centring would
  have narrowed that slab without changing what it is.
- **Two class changes, nothing else.** The track drops `gap-3 px-[6%]` and is now plain
  `flex h-full`; slides drop the `w-[88%] overflow-hidden rounded-lg` / `w-full` branch for plain
  `w-full` (the radius and clipping only existed to make a peeked neighbour look like a card).
  `step` is measured from `offsetLeft`, so removing the gap propagates on its own, and `maxDrag`,
  `dragConstraints`, and every snap target derive from `step`. `hasMultiple` still gates drag,
  the wheel listener, `tabIndex`, arrows, and dots.
- **Everything #47 added survives.** Horizontal slide motion, trackpad wheel, drag, arrows, dots,
  Left/Right keys, reduced-motion path. Only the gutters are gone.
- **The gate that let it through.** Variant B was picked from a preview that rendered one width.
  A component with two callers at 494px and 838px needs both widths in the preview, or the pick
  is made on a surface the visitor may never see.

Verification: homepage Lab card measures a 494px box, a 494px slide, 0/0 gutters, and dot 2
settles the track at exactly `-494`; the `/projects` row measures an 838px box, an 838px slide,
0/0 gutters, and dot 3 settles at exactly `-1676` (2 × 838). `npx tsc --noEmit` clean, exit 0.
Reading a motion value straight after a dot click still returns a mid-spring number in a hidden
automation tab (`-32`, `-8`) — the #47 gotcha, unchanged: force a frame with a screenshot first,
then read.

Not touched, pre-existing: on the homepage card the dots (`bottom-3`, centred) overlap
CometAdvisor's "Start Session" button. Visible in the owner's screenshot, out of scope here.

### 2026-08-23 — Swipeable slideshow: trackpad, touch, keys (#47)

Replaces `MediaCarousel`'s crossfade with a horizontal track that follows the gesture. First
ticket of the post-launch projects batch (split from "fix projects section" into #45 content,
#46 expanded-row redesign, and this).

- **One motion value, three inputs, one exit.** The track is a single `motion.div` (flex row,
  every slide stays mounted) whose `x` is a `useMotionValue`. Framer `drag="x"` handles touch and
  mouse, a native `wheel` listener handles the trackpad, `onKeyDown` handles Left/Right, and
  arrows/dots call the same helper. Everything ends in `snap(index)`, which clamps, sets state,
  and animates `x` to `-index * step`. No carousel library.
- **The trackpad rule: one gesture, one slide.** On each `wheel` event, if `|deltaX| <= |deltaY|`
  it returns and the page scrolls. Otherwise `preventDefault()` (which kills Chrome's back-swipe),
  then accumulate `deltaX`; at `WHEEL_FIRE_PX` (40) it fires once and **locks**. The lock swallows
  the rest of the burst including macOS momentum, and only `WHEEL_QUIET_MS` (150) of silence
  releases it. The listener is attached with `{ passive: false }` in an effect because React marks
  `onWheel` passive and `preventDefault` would be ignored. Both numbers are still labelled guesses
  in the source; the owner swiped the preview and kept them.
- **Owner picked variant B of three previews.** Peek: 88% slides, 12px gap, 8px radius, so
  neighbours show at both edges, keeping the existing dots. A was flush with a segmented bar,
  C was flush with a `1 / 3` badge and a sliding underline.
- **Ends clamp, they do not wrap.** The old `goTo` wrapped with a modulo. With a sliding track,
  wrapping last-to-first would visibly rewind across every slide, so `snap` clamps and the arrow
  on a closed end is not rendered. This is a real behaviour change, not just a visual one.

Two defects found at gate 2 that the plan had not anticipated:

- **`dragConstraints={ref}` would have pinned the track.** The plan assumed the track's width
  minus the viewport equals `(count - 1) * step`. It does not: the track is a *block-level* flex
  container, so its border box measures exactly the viewport (838px) while its `shrink-0` slides
  overflow it (`scrollWidth` 2021). Framer measures `getBoundingClientRect()`, so reproducing its
  `calcConstraintsForAxis` gave `min === max` — a zero-width range — when the track needs to
  travel to -1322px. The failure would have been easy to miss: `info.offset.x` still reports the
  true pointer distance, so slides would have changed on release while the track rubber-banded
  instead of following the finger. Now constrained numerically (`{ left: -maxDrag, right: 0 }`)
  from the `step` the ResizeObserver already measures, so no box measurement is involved.
- **The peek broke the single-item carousel.** Applied unconditionally, TechAssist's lone YouTube
  slide shrank to 649px inside an 838px frame with uneven gutters (50px / 139px). There is no
  neighbour to peek at, so the gutters were pure regression. The peek classes now apply only when
  `hasMultiple`; a lone slide is `w-full` in an unpadded track, exactly as before.

Left open as **#48** (question): the peek is lopsided — `w-[88%]` resolves against the track's
already-padded content box, landing the slide at 77.4% with 50px of gutter left and 139px right.
`w-full` would make it a true 88% with 50/50 gutters. Shipped as previewed and accepted; the
one-line alternative is measured and recorded on the ticket.

Verification (no test suite here): one trackpad gesture advanced exactly one slide on `/projects`
and all three homepage cards; a mouse drag tracked the pointer 1:1 (`translateX(-60px)` for a
60px move) and settled at exact multiples of `step` (-661, -788, -1322); vertical wheel stayed
unprevented; arrows vanished at the ends; keys clamped. `npx tsc --noEmit` clean, exit 0.
Reduced motion and YouTube playback were **not** runtime-verified (see the gotcha in STATE.md).

### 2026-08-21 — Purpose-made 1200x630 OG share card (#34)

First post-launch ticket. Replaces the mis-declared headshot in link previews with a card built
for the slot.

- **The bug was a lie in the tags, not a missing file.** `openGraph.images` and `twitter.images`
  both pointed at `/godfrey_headShot.JPG` and declared `width: 1200, height: 630`. The file is
  1000x879. With `twitter:card` set to `summary_large_image`, a scraper that trusts the tag
  reserves a 1.90:1 slot and receives a 1.14:1 portrait. Now the declared numbers are the file's
  real numbers.
- **Owner picked variant C of three.** A — editorial nameplate, name alone at Fraunces 148px with
  an accent rule; B — tagline-led, the hero line in Fraunces italic under a 96px name; C — split,
  text left and the headshot filling a 440px right column. C ships: name at 112px wrapping to two
  lines, `DEVELOPER`, `godfreyponce.dev` in accent `#c2410c`, on surface `#fafaf9`.
- **New filename `/og-card.png` is the cache-bust.** Scrapers key OG images by URL and cache hard,
  so a new path is the only reliable way to change what a previously-scraped link shows.
  `godfrey_headShot.JPG` was never touched; the hero still renders it.
- **Exact pixels came from the Chrome CLI, not the automation screenshot tool.** Automation
  screenshot space is scaled (see the coordinate gotcha), so it cannot produce a guaranteed
  1200x630. Headless Chrome can:

  ```bash
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless --force-device-scale-factor=1 --window-size=1200,630 \
    --hide-scrollbars --virtual-time-budget=10000 \
    --screenshot="<abs path>/public/og-card.png" "file://<abs path>/public/og-render.html"
  ```

  `sips -g pixelWidth -g pixelHeight` then confirmed 1200x630 exactly, as a gate rather than an
  assumption.
- **`--virtual-time-budget` is load-bearing, not padding.** It makes Chrome wait out the Google
  Fonts fetch. Without it the card can capture mid-load and ship with a fallback serif instead of
  Fraunces, which is invisible in the command's output and obvious only in the PNG.
- **Chrome writes the file correctly while printing `Trying to load the allocator multiple times.
  This is *not* supported.` to stderr.** Harmless noise on this machine, not a failed render.
  Check the file, not the stderr.
- **Preview files DO work from `file://`, and this proved it.** The throwaway render page loaded
  over a `file://` URL with a relative `godfrey_headShot.JPG` src and the photo is in the output.
  Relative paths inside `public/` resolve under `file://`; the standing gotcha is only that the
  *automation* `navigate` tool refuses the scheme. The Chrome CLI does not.
- **The 300px legibility criterion was checked by reading, not by trusting.**
  `sips --resampleWidth 300` produced a 300x157 copy, the size an iMessage bubble gives it. Name
  comfortable, role and URL both still decipherable. Variant B was flagged at pick time as the one
  whose 46px italic tagline would have gone soft at that scale.
- Both throwaway previews (`public/preview-og.html`, `public/og-render.html`) were deleted before
  landing, per the visual-change workflow.

### 2026-08-20 — #33 analytics: already working at the Cloudflare edge, code reverted

**Net code change: none.** The site has had working visitor analytics since roughly Dec 2025.
Nobody knew, so this ticket was planned and built twice against a problem that did not exist.
This entry exists so it does not happen a third time.

- **`godfreyponce.dev` is proxied through Cloudflare, with Amplify as the origin.** Nameservers are
  `lars/princess.ns.cloudflare.com`, the A records are Cloudflare's (`172.67.194.166`,
  `104.21.44.38`), and the live response carries `server: cloudflare` + `cf-ray` alongside
  `via: ...cloudfront.net`. Traffic goes visitor → Cloudflare → CloudFront/Amplify. This is the
  fact everything else follows from, and no ticket had ever written it down.
- **A Web Analytics site in AUTOMATIC setup mode injects the beacon at the edge.** Because the zone
  is proxied, Cloudflare rewrites every HTML response to add its own beacon `<script>`. Verified
  present on `/` and `/projects`, token `77d792c890fe454cbefc4b9aed62f7c9` (public by design, it
  ships in the page source of every Cloudflare-analytics site). No repo code is involved.
- **Done-when verified end to end:** a real browser visit to the live site fired
  `POST https://godfreyponce.dev/cdn-cgi/rum` → **204**. No cookie banner ships. That is #33's
  acceptance criterion, met by infrastructure that predates the ticket.
- **The beacon POSTs SAME-ORIGIN, not to cloudflareinsights.com.** On a proxied domain it is
  `<your-domain>/cdn-cgi/rum`. Both plan files said to watch for a `cloudflareinsights.com` POST,
  so the correct behavior looked like no behavior. Only `beacon.min.js` itself comes from
  `static.cloudflareinsights.com`.
- **curl does NOT see the beacon; that is not a bug.** Cloudflare skips injection for non-browser
  user agents, so `curl https://godfreyponce.dev | grep cloudflareinsights` returns nothing while a
  real browser gets the tag. This produced a confident, wrong "automatic setup is broken" reading
  mid-session. Send a browser UA before concluding anything about edge injection.
- **Why the landed code was reverted rather than kept.** It rendered a SECOND beacon with the same
  token on every page, on top of the edge-injected one: two script instances, two pageview beacons,
  roughly doubled counts. Keeping it would have been worse than doing nothing. Reverted in
  `2d41ed6`; `app/layout.tsx` is byte-identical to its pre-ticket state.
- **The rejected alternative, for the record.** Keeping the code was viable IF automatic setup were
  switched off in the Cloudflare dashboard, trading edge magic for an explicit tag that survives
  un-proxying the domain or leaving Cloudflare. Owner chose the revert: analytics already works with
  zero moving parts, and a build-time `NEXT_PUBLIC_` var is a silent single point of failure.
- **The dashboard reading "0 visits" meant no visitors, not a broken beacon.** Obvious in hindsight
  on an unlaunched site; it was read as evidence of breakage twice.
- **Both prior attempts produced only reverts.** 2026-08-11 wired `@vercel/analytics`, which posts to
  `/_vercel/insights/*` — a path that only exists when Vercel serves the site, so it silently no-ops
  on Amplify. 2026-08-20 wired the Cloudflare beacon via `next/script`. Neither shipped a line.
  **Check the running system before building for it.** One `curl -I` with a browser UA, eight months
  earlier, would have closed this ticket without a plan file.



### 2026-08-19 — Pixel-art cmux chevron fronting the footer day-total line (#44)

- **Owner picked variant C of three.** A — flat `currentColor` mono; B — the same glyph plus a
  35% copy offset one cell right for depth; C — the same glyph in flat blue `#3b82f6` (rows 0-1),
  indigo `#6366f1` (row 2), violet `#8b5cf6` (rows 3-4), nodding at the cmux app icon's gradient
  without being one. C is the only variant that is *not* `currentColor`, so it will not follow a
  theme flip. That was stated at pick time and checked against the light surface `#fafaf9` on the
  preview's second strip; accepted knowingly, not overlooked.
- **B's shadow offsets RIGHT, not down, and that is not a style choice.** On a chevron whose rows
  step diagonally, a down-offset copy lands exactly on the glyph's own next row and disappears.
  Worth remembering if a future ticket wants depth on a diagonal pixel glyph.
- **The crispness is arithmetic, not a CSS property doing the work.** `shape-rendering="crispEdges"`
  only helps if cells never straddle a device pixel. A 4x5 viewBox rendered at 8x10 CSS px is
  2 CSS px per cell, so 2 device px at 1x and 4 at 2x — integer both ways. Keep the cell at 2;
  a fractional size would put `crispEdges` in the position of having to round, which is where
  pixel art goes soft.
- **Baseline alignment came free from `inline-block`.** An inline-block box sits its bottom edge on
  the text baseline, and the row's cap height measured 9.94px against the glyph's 10px, so the
  chevron spans baseline to cap height with no `vertical-align` fudge. Nothing to tune here if
  the footer's `text-sm` ever changes; re-measure cap height and match the glyph's px height.
- **Drawn from scratch, deliberately.** The pixel-icon sheet the owner shared in session is
  watermarked Adobe Stock and set the *style* target only (chunky blocks, hard edges, limited
  palette). The rect grid was authored in the plan file. Nothing was traced, copied, or embedded.
- **Copy changed at gate 2 after the owner asked what the numbers were.** They read as a commit
  count; they are lines. So `today:` became `lines changed today:` and the no-push line followed
  from `godfrey no commit (yet)...` to `godfrey no line change (yet)...` (that string is quoted in
  a STATE.md gotcha, updated with it). The `+N -N` semantics did not change, only what the line
  claims about them.
- **The glyph was on the day-total branch only, until 2026-08-25.** The ticket's wording left the
  no-push line and the tokenless empty span untouched. Then the owner saw the chevron vanish on
  a day with no push and asked for it back; the SVG became a module constant rendered on both
  data branches (commit `20c4895`). The tokenless empty span is still bare.
- **The fallback branch was verified in source, not on screen, and that is a real gap.** Forcing it
  means stubbing the API response, which the plan ruled out, and a tokenless run does not reach it
  either: `{today: null, date: null}` falls through to the empty span. It is a one-line string swap
  in a branch that already rendered correctly under #43, so the risk was accepted. Live-verified
  branch: `lines changed today: +8311 -1102` with the chevron, at DPR 2. `npx tsc --noEmit` clean.

### 2026-08-19 — Today's diff stats summed across ALL repos via GraphQL (#43)

- **The footer stopped describing one push and started describing a day.** `latest commit
  <phrase>: +N -N` became `today: +N -N`, summed across every repo the owner pushed to today,
  private repos included. Owner decision at ticket time: total only, no repo count, no names.
- **Two REST calls became one GraphQL query.** `Commit.additions/deletions` exist directly on
  the GraphQL type; REST only gives them one commit at a time via `/repos/{o}/{r}/commits/{sha}`.
  Measured cost was 1 point of the 5000/hour GraphQL budget, so a 10 min TTL is 6 points/hour.
- **This fixed the #42 lag bug as a side effect, which was the real point.** The REST events feed
  runs hours behind the refs: at 21:00Z it still named lava-2 newest while portfolio's 20:42Z
  commit was already on `origin/main`. GraphQL reads refs, so no TTL tuning was ever going to
  fix it and none was attempted.
- **"Today" is the OWNER's midnight, America/Chicago, computed server-side.** A visitor in Tokyo
  sees the owner's work day. `chicagoDayStart(now)` is pure for the same reason `computeStreaks`
  is, verified with a one-off node run: `2026-01-15T03:00Z → 2026-01-14T00:00:00-06:00` (CST),
  `2026-07-15T03:00Z → 2026-07-14T00:00:00-05:00` (CDT). It uses *now's* offset, so on the two
  DST transition days a year the boundary can be an hour off near midnight. Accepted.
- **Scope is narrower than "all lines you changed today", and the limits are the design:**
  owner-authored commits only (`author: {id: "U_kgDOBhysEw"}`, so collaborators can't inflate
  it), default branch only (all 8 active repos are `main`-only, verified), pushed commits only
  (GraphQL reads GitHub's refs, so local work is invisible), and repos the owner *owns* only
  (`viewer.repositories` returned 49, every one `godfreyponce/*`, so work pushed to someone
  else's repo does not count). `first: 15` repos is a measured bound: 15 covered every repo
  touched in the previous month and `PUSHED_AT DESC` sorts today's repos to the front.
  `first: 100` on a day's history is GitHub's own page max, not an invented cap.
- **Tokenless renders NOTHING, and the REST path was deleted rather than kept.** GitHub refuses
  GraphQL without a token even for public data, so there is no anonymous path to build. Rejected
  keeping the public feed as a tokenless backup: a second permanent data path in the route, for
  a case only the owner hits, on a private repo nobody clones. `GITHUB_TOKEN="" npm run dev`
  returns `{"today":null,"date":null}` at HTTP 200, footer renders an empty span, no errors.
- **Owner changed the fallback copy at gate 2, and three things followed.** The no-commits line
  was specced as #40's recency copy and became the static `godfrey no commit (yet)...`. So:
  `commitPhrase` lost its only caller and was deleted; the recorded timezone seam (visitor-local
  "today" disagreeing with the server's Chicago day near midnight) dissolved because a static
  string has no clock; and `date` stopped being rendered but stayed in the payload as the
  "this query returned real data" signal, which is what keeps a tokenless clone from falsely
  claiming the owner had not committed.
- **Verified live, both branches, not by inspection.** Real payload
  `{"today":{"additions":6133,"deletions":646},"date":"2026-08-19T21:42:53Z"}` rendering
  `today: +6133 -646` in green/red; fallback forced with a future `since` rendering
  `godfrey no commit (yet)...`. The total was reconciled against a per-repo breakdown:
  skillbook 2013/18 + lava-2 3948/585 + portfolio 172/43 = 6133/646 exactly, with no Aug 18
  commit crossing the boundary. `npx tsc --noEmit` clean.
- **Privacy, on the record.** This is a wider disclosure than #42, which revealed one push's
  size. Total daily volume across every private repo now renders on a public page, and day one
  proved the point: 6133 additions, dominated by files the owner did not type (1927 lines of
  tracked plan files, 868 of vault churn, 577 from a plugin version bump). The owner asked for
  this deliberately and accepted the number after seeing it. Withheld stays withheld: no names,
  no SHAs, no messages, no breakdown.
- **Merge commits still report their diff against the first parent** (trackerdash carries 3 in
  its last 40), same accepted quirk #40 recorded.

### 2026-08-19 — Diff stats shown for private pushes too (#42)

- **Reverses #41's decision 2 by owner decision.** #41 deliberately withheld `+N -N` on private
  pushes and left the question open. On 2026-08-19, right after #41's deploy landed, the owner
  read the numberless line as a regression and confirmed the bare numbers are acceptable. What
  stays withheld is unchanged: no repo name, no SHA, no commit message, no file list. Two
  integers only.
- **The gate moved from the push to the token.** `if (push.public !== true)` became
  `if (!token && push.public !== true)`. The real precondition was never publicness, it was
  auth: `/repos/{o}/{r}/commits/{sha}` 404s on a private repo without a Bearer header. The
  public check survives only as a tokenless fail-closed guard, so a non-public event appearing
  in the public feed still cannot provoke a guaranteed 404.
- **Stats became best effort.** Non-ok response, non-numeric stats, or a throw all return
  `{ date }` now. Before, a failed stats call threw (stale-on-error silently kept the OLD date)
  and non-numeric stats returned `null` (the line vanished). The events fetch still throws, so a
  fresh date is never discarded because the *second* call hiccuped. This is gentler on the error
  path for public pushes too, which the plan flagged and the owner accepted.
- **`LatestCommitLine.tsx` needed no code change.** Its `#41` recency-only branch was already the
  right rendering for "no stats attached"; only its comment was wrong. Same for the two comments
  in `lib/github.ts`. Three files changed, one of them real.
- **Verified against a genuinely private push**, not a simulated one: newest push was
  `godfreyponce/lava-2` with `public: false`, route returned `+65 -9`, and
  `gh api repos/godfreyponce/lava-2/commits/3bbb670 --jq .stats` returned the same
  `{"additions":65,"deletions":9}`. Tokenless run returned the newest *public* push
  (`godfreyponce/GodfreyPonce`, 2026-08-12) with no attempt against the private repo.
- **A bug surfaced during verification and did NOT get fixed here** (it is #43): the REST events
  feed lags. The tokened run named lava-2 as newest at 21:00Z while `git ls-remote` showed
  portfolio's 20:42Z commit already on `origin/main`. The footer was showing a stale winner, and
  the TTL is not the cause. Also learned: the authenticated feed redacts private repos' payloads
  down to `before`/`head`/`push_id`/`ref`/`repository_id`, with no commits array.

### 2026-08-19 — Authenticated latest-commit call so private pushes count (#41)

- **The bug #40 shipped with:** the footer read "latest commit 6 days ago" on a day the
  owner had committed repeatedly. Cause confirmed, not guessed: the newest *public*
  PushEvent was 2026-08-12 to godfreyponce/GodfreyPonce, and every commit that day went
  to private repos (this portfolio included). The public events feed never shows them.
- **Owner chose the authenticated call** (2026-08-18) over the two alternatives, a
  contributions-calendar "last active" date and rewording the line to admit it is
  public-only. A server-side token adds no page weight and lifts the limit from 60
  req/hour to 5000.
- **Hybrid copy, decided at the same time:** private pushes move the *date* but must not
  leak private activity detail. Private newest push renders `latest commit today` with no
  colon and no numbers; public is byte-identical to #40, `latest commit N days ago: +N -N`.
- **`GITHUB_TOKEN`, server-only** — no `NEXT_PUBLIC_` prefix, so it cannot reach the client
  bundle. Present: the route hits `/users/godfreyponce/events` with a Bearer header.
  Absent (fresh checkout): `EVENTS_URL` and the headers fall back to the exact #40
  constants, so a tokenless clone degrades to public-only rather than erroring.
- **Fail closed on the event's `public` field.** The stats fetch runs only when the event
  says `public: true` explicitly; a missing field counts as private. So a private push
  costs one API call instead of two, never reaches `/repos/{owner}/{repo}/commits/{sha}`,
  and the response carries no repo name. Worst case on a malformed event is recency-only,
  which leaks nothing.
- **The stats fields are optional and both-or-neither** across all three layers — route
  `Commit`, `lib/github.ts` `LatestCommit`, and the JSON validation in `getLatestCommit`.
  `LatestCommitLine` destructures before the guard so TypeScript narrows the properties;
  a `hasStats` boolean would not narrow them.
- **Classic PAT with `repo` scope, not fine-grained.** Fine-grained tokens are reported not
  to surface private events on the events feed. If that ever gets swapped, verify the feed
  actually shows private pushes before trusting it.
- **Verified at gate 2 with the leak check made explicit:** the authenticated feed's three
  newest pushes all read `public: false` *and all carry a repo name*, so the route had the
  private name in hand and dropped it. The route's response was `{"commit":{"date":
  "2026-08-18T17:37:56Z"}}` — keys `['date']` only, no `/` anywhere in the body. Tokenless
  restart reproduced #40's exact response and footer. `npx tsc --noEmit` exit 0, no output.
- **A stats-missing public commit still returns null** and hides the line, exactly as #40
  did, rather than degrading to date-only — "public unchanged" was a hard requirement.
- **Token expiry fails soft, and silently.** GitHub starts 401ing, stale-on-error serves
  the last good value, then the route is effectively back on the public-only feed: the site
  never breaks but the date quietly goes stale. Worth a calendar note near the expiry date.
- **Amplify caveat carried into the close-out:** Amplify has historically exposed console
  env vars at build time only, not to the SSR compute at runtime. If the deployed footer
  keeps showing the old public date after the env var is set, the documented workaround is
  `env | grep -e GITHUB_TOKEN >> .env.production` in the console build spec (no `amplify.yml`
  in this repo). Newer SSR runtimes may not need it — verify before adding it.

### 2026-08-18 — Latest-commit status line in the footer (#40)

- **Ask:** cmrg.me's footer stat, filling the empty left cell #39 reserved. Shipped
  copy is `latest commit today: +N -N`, additions green, deletions red, all lowercase
  to match the stat-line register.
- **Owner picked variant A** from `public/preview-commit-line.html` (deleted after the
  pick): GitHub's own diff colors as `@theme` tokens, `--color-diff-add: #3fb950` and
  `--color-diff-del: #f85149`. The label stays at the footer's own `text-white/50` and
  the numbers keep the inherited weight — variant C's faint-label + tabular-numbers
  treatment was not taken.
- **Two GitHub calls, not one.** The public events feed carries the PushEvent but no
  line stats, so `app/api/latest-commit/route.ts` finds the newest PushEvent and then
  hits `/repos/{owner}/{repo}/commits/{sha}` for `stats.additions/deletions`. No token
  by owner decision (the portfolio repo is private and invisible without one), so the
  budget is GitHub's 60 requests/hour per-IP unauthenticated limit. GitHub also rejects
  requests with no `User-Agent` — the route sets one.
- **The cache is a module-level TTL, deliberately not `fetch revalidate`.** #24 proved
  Next's data cache untrustworthy on Amplify (CloudFront froze ISR), so this route keeps
  its value in module memory and pairs `force-dynamic` with `cache-control: no-store` to
  keep both CloudFront and the data cache out of the path. TTL is 10 minutes on a stated
  basis: two calls per refresh caps one warm instance at 12 calls/hour against the 60.
  On upstream failure it serves the last good value and re-arms the TTL, so a broken
  GitHub doesn't turn into a call per pageview.
- **Push time, not the commit's author date.** "latest commit today" means activity
  today; a rebased or old-authored commit pushed this morning would otherwise read as
  days old.
- **The relative phrase is computed in the browser**, not baked into the response, so a
  server-cached value can't keep saying "today" past midnight. `commitPhrase(dateISO, now)`
  is pure for the same reason `computeStreaks` is — verifiable with a one-off node run.
  Calendar-day difference in the viewer's local timezone; clock skew that puts the push in
  the future still reads "today". (`commitPhrase` was deleted by #43, when the fallback line
  became static copy and nothing called it any more.)
- **Failure is an empty cell, never a broken stat.** The route answers `{commit: null}`,
  `getLatestCommit()` returns null on any HTTP or shape failure, and the client component
  renders a bare `<span />` both while loading and on failure — so the bottom row's
  layout is identical to the placeholder #39 shipped.
- **Known accepted quirk:** when the newest push is a merge commit, GitHub's stats count
  the whole merge diff, so the numbers can spike. Accepted at plan time — it is still the
  latest public activity.
- **Worth knowing on Amplify:** the cache is per server instance, so several warm
  instances each pay their own first fetch and can briefly disagree by up to the TTL.
  That's inside the rate-limit budget by design, but it means the line is not
  instantaneous after a push.
- **Verified:** owner accepted the branch at gate 2; `npx tsc --noEmit` re-run clean on
  merged main at accept.

### 2026-08-18 — Footer pinned under the page, uncovered at the bottom (#39)

- **Ask:** cmrg.me's footer that "opens" as the visitor reaches the page bottom.
- **The reference effect is not an animation.** Measured off cmrg's live DOM: the
  footer is `sticky bottom-0 z-0`, pinned to the viewport bottom for the *entire*
  scroll (at scrollY 0 its rect top is already `viewportHeight - footerHeight`),
  painted under an opaque `z-10` lid that holds the rest of the page. Scrolling
  past the end of the lid uncovers it; scrolling back covers it. No scroll
  listeners, no transitions, no scroll-linked opacity anywhere. "Opens and
  closes" is entirely the lid sliding off and back on, which is why the boundary
  cannot jank.
- **Three variants previewed** in `public/preview-footer.html` (deleted after the
  pick): A the silent curtain, B the curtain plus a staggered Framer Motion
  wake-up once ~120px is uncovered, C a literal collapsed strip that unfolds a
  panel at absolute bottom. Owner picked **A**. Consequence worth remembering:
  the shipped footer uses **no Framer Motion at all**, so the ticket's
  "smooth via Framer Motion" and `prefers-reduced-motion` lines are satisfied
  vacuously — there is nothing to animate.
- **C's flaw, found while verifying, not while planning:** its unfold triggers
  when you are already at the bottom, so the panel opens *below* the viewport and
  nothing appears to happen until you scroll again. A and B reveal into the space
  you are already looking at. Worth carrying into any future "expand at bottom"
  idea.
- **Owner cut the drafted sign-off note at the gate**, which drops the ticket's
  "expanded state shows a short sign-off note" bullet by owner decision. The
  revealed layout is name + three social links on top, then a split bottom row:
  empty left slot reserved for #40's latest-commit line, copyright right. The
  copyright also lost its trailing period.
- **`app/page.tsx` restructure is the load-bearing half.** Everything except the
  footer moved into one `relative z-10 border-b border-rule bg-surface shadow-lid`
  div; `<Footer />` became the last direct child of `<main>`. The lid's explicit
  `bg-surface` is required — the old divs were transparent and the body painted
  the background, which would let the footer show through. `overflow-x-clip` on
  `<main>` stays and is now doubly load-bearing: `overflow-x-hidden` would make
  `<main>` a scroll container and kill the sticky pin.
- **`--shadow-lid` added to globals.css** rather than an inline
  `shadow-[0_24px_48px_...]`, since the file's own header rule forbids arbitrary
  values in components and the codebase had zero of them. On our dark footer the
  shadow is nearly invisible; the light `border-b border-rule` is what actually
  reads as the seam.
- **Verified:** sampled 21 scroll positions from 0 to 5687 — the lid covers the
  viewport bottom at every one, and the footer only shows in the last 229px of
  scroll, so nothing peeks mid-page behind the Hero background or the sticky Lab
  cards. All three footer links hit-test to themselves (`elementFromPoint`), so
  the `z-0` footer is not intercepted by the lid. Real-cursor hover on GitHub
  lifted it 701 → 700 with the #38 tactile signature intact. Mobile at 371px via
  the iframe trick: stacks name → icons → divider → copyright, reveal still works.
  `tsc --noEmit` clean.
- **Untested:** macOS rubber-band overscroll past the bottom may flash the light
  body background under the dark footer. Automation cannot reproduce rubber-band.

### 2026-08-17 — Tactile raised/pressed hover physics (#38)

- **Ask:** cmrg.me's solid button feel on the hero social links, the footer
  icons, and The Lab's "See all projects" CTA. Measured off cmrg's live DOM
  rather than described: rest state is a bevel (inset white highlight, two
  stacked drop shadows, the 1px ring living *inside* the shadow stack, plus a
  radial sheen `::before`), hover deepens the shadows and fades the sheen with
  **no** transform, press is `scale(0.975)` with the shadows compressing. All
  at 150ms.
- **Why the reference could not be copied literally.** cmrg is a dark site, and
  its "raised" reading comes almost entirely from an inset *white* highlight —
  which is invisible on our `#fafaf9`. The light-theme adaptation had to move
  the raise into drop shadows plus `translateY`, which is what the variants
  explored.
- **Two preview rounds.** Round 1 offered A (press only), B (lift), C (full
  bevel); owner picked C but asked for the pill behind the links to go. "Leave
  out the pill" reads two ways, so round 2 split it rather than guessing: C1
  (no shape on links, icons keep the pill), C2 (no shape anywhere), C3 (shape
  kept but squared to 6px). Owner picked **C2**. `public/preview-tactile.html`
  deleted after the pick.
- **Shipped:** `.tactile-link` carries motion and color only — 1px rise on
  hover, `translateY(1px) scale(0.96)` on press — and is used unchanged on both
  the light hero row and the dark footer. `.tactile-btn` keeps the full
  rest-state bevel and presses into it at `scale(0.975)`.
- **The plan's `.tactile-link-dark` was dropped.** It existed to carry
  dark-surface background and shadow values; C2 has none, so it would have been
  an empty class. For the same reason the link transition is `transform, color`
  and not also `box-shadow, background-color`.
- **The padding/negative-margin pair is deliberate, not pill leftovers.**
  `padding: 6px 12px; margin: -6px -12px` draws nothing now that there is no
  background — it widens the hit target, and the equal negative margin is why
  the row's `/` separators never move (verified: identical x positions hovered
  and not).
- **`.hover-bubble` stays** for About's inline prose links; button physics fight
  underlined prose identity. Also consciously excluded: the 404 back link, the
  ProjectsIndex home link, and ProjectCard's external-link rows.

### 2026-08-16 — Hover color-scramble on the hero tagline (#37)

- **Ask:** inspired by cmrg.me. Letters light under the cursor and ease back,
  leaving a decaying trail. The reference was a screen recording
  (`~/Desktop/ticket-37-video.mov`), not a description, so the spec was
  measured off frames rather than described.
- **Three preview rounds, and the middle one is the lesson.** Round 1 was
  rejected as too saturated. Round 2 translated the recording's measured
  glyph colors faithfully (dusty, sat 0.25-0.65) and was rejected as too
  dull. Measuring the frame the owner sent back explained both: the
  reference's own chroma is *low* (red C=0.120, gold 0.090, green 0.050,
  blue 0.059 in OKLCH). All of its apparent brightness comes from light
  glyphs on a near-black ground. On our `#fafaf9` there is no value that
  reproduces both its literal colors and its punch, so brightness had to
  come from chroma instead.
- **Palette method (worth reusing).** Holding chroma constant across hues
  fails: at fixed lightness gold and green hit the sRGB wall around
  C≈0.11-0.13 while red and blue keep climbing, so the four stop reading as
  one set. Instead each hue sits at the same *share of the chroma it can
  actually reach* at that lightness. Owner picked **J**, the gamut edge:
  `#f00013` `#a67600` `#6e8e00` `#566dff`, at L=0.60 with the recording's
  measured hues (OKLCH 28 / 80 / 124 / 271). Contrast on the ground stays in
  a 3.6-4.3 band. Decay **1.0s**, the long end of the measured 0.7-1.0s
  bracket. `public/preview-scramble.html` deleted after the pick.
- **Shipped:** `components/ui/ScrambleText.tsx` is a client component only
  because the color re-randomizes per pass (measured: "computers" reads
  o=blue m=red on one sweep, o=red m=blue on the next). `mouseenter` writes
  `--scramble-color` inline, `mouseleave` clears it. No React state, no
  re-renders; `Math.random()` runs only in handlers, never in render, so
  hydration stays deterministic. CSS does all motion: color snaps in
  (`transition-duration: 0s` while `:hover`) and eases out over 1s once the
  var is cleared. Hero stays a server component.
- **Reduced motion needs no override block.** The whole thing lives inside
  `@media (prefers-reduced-motion: no-preference)`, so under `reduce` there
  are simply zero matching rules: the var is still set by JS but never
  consumed. Verified against the compiled CSS chunk, not the source.
- **Two fixes the plan didn't anticipate:** the `sr-only` copy sits inside
  the `<p>`, so selecting the tagline copied the sentence *twice* until it
  got `select-none` (still in the DOM, still read by AT, just out of the
  clipboard). And `cursor: pointer` (owner asked for it) sits on
  `.scramble-line`, not the letters, or it flickers back to a caret over
  every space; it is inside the no-preference gate too, since with the
  effect off it would advertise nothing.
- **Confetti dropped.** The recording has a click-triggered burst at
  t≈10.7; owner ruled it out at the plan gate. Not built, no ticket.

### 2026-08-14 — Custom 404 page: stickman chases the missing page (#31)

- **Ask:** the site served the default Next.js 404 (pre-launch checklist item,
  2026-08-10). Give bad URLs an on-brand page with a link home.
- **Design locked from previews** (two build sessions, gate between them):
  A = idle stickman beside a big Fraunces 404, B = Snapchat-style streak
  numeral counting up, C = stickman sprinting across a band chasing a fleeing
  page glyph. Owner picked **C with B's count-up grafted on**, numeral staying
  Fraunces (asked and answered explicitly — it does not switch to the Nunito
  Sans streak face). `public/preview-404-{a,b,c}.html` deleted after the pick,
  never committed.
- **Shipped:** `app/not-found.tsx` stays a server component, so
  `export const metadata` still sets the tab title to "Page not found";
  only the counter is a client child. `components/NotFoundCounter.tsx` runs
  0 → 404 on mount, ease-out cubic over 900ms, the same curve as the streak
  counter (#26). `tabular-nums` but no width reservation: unlike variant A
  (numeral in a flex row beside the stickman, which needed `min-w-[3ch]` to
  stop him sliding), C's numeral is a centered block on its own line and grows
  symmetrically. `app/globals.css` gained the `nf-*` block: a 7s linear
  `translateX(-220px → 100vw+40px)` crossing, a two-frame run cycle swapped by
  `steps(1)` opacity every 0.25s, a bobbing page glyph, and a reduced-motion
  branch that hides both frames plus the glyph and swaps in a centered
  standing wave. Stickman geometry copied from `StickmanRunner.tsx`.
- **Plan deviation (the only one), owner-approved at the preview gate:** the
  band's ground rule spans the full viewport, so with the home link *below* it
  the rule read as a section divider slicing the link off from the 404 above
  (worst at 768px). Order became 404 → blurb → link → band, which turns the
  band into a footer strip and lets the rule read as ground under the runner.
- **Verification:** Chrome at localhost:3000 — unmatched URL returns a real
  HTTP 404 (not a 200), count-up lands on 404, runner loops across the band,
  home link navigates to `/` and the homepage still renders; ~390px via
  same-origin iframe: no horizontal overflow, numeral clamps to its 96px
  floor, blurb and link each hold one line. `tsc --noEmit` exit 0. Plan
  `docs/plans/2026-08-13-issue-31.md`.
- **Flagged at accept, deliberately not "fixed":** the stickman is a fixed
  200×140 SVG next to a fluid `clamp(96px,20vw,160px)` numeral, so he reads
  small at desktop and proportional at 390px. The shipped Fraunces is chunkier
  than the previews looked — preview HTML pulled it from the Google CDN with
  the `opsz` axis live; `next/font` does not expose that axis, so the numeral
  now matches the hero heading exactly. Without JS the numeral stays `0`
  (SSR renders `<h1>0</h1>`); every alternative trades a visible 404 → 0 →
  count flash on hydration.

### 2026-08-13 — /projects grouped into README sections, 7 GitHub projects added (#36)

- **Ask:** /projects listed only the four hackathon-era projects; the day-to-day
  GitHub projects lived only in the profile README. Add seven (kal, Debrief,
  glass, Jira-Alerts, jiraPlane, clawd, terrariaCompanion; LocalPro-Realty
  deliberately excluded, owner 2026-08-13) and carry the README's grouping.
- **Design locked from previews** (owner picks at the plan's Task 1 gate): group
  names as `text-2xl` Fraunces display headings, groups in README order
  (daily → work → hackathons → misc). The plan's variant A deleted the filter
  pills; the owner wanted a control instead, so a second preview round of 3
  toggle styles picked text links with an underlined active state. The existing
  four became "Hackathons and sprints" (Remix was a school ML sprint, not a
  hackathon). `public/preview-{a,b,c}.html` deleted after wiring, never committed.
- **Shipped:** `lib/projects.ts` gained `ProjectGroup`
  (`"daily" | "work" | "hackathons" | "misc"`), a required `group` on `Project`,
  `GROUPS` (array order = page order; `label` = long section header, `tab` = short
  toggle label), and the seven entries. Those carry no date/tags/media/icon on
  purpose: `projectsNewestFirst()` gives undated rows `dateKey` 0 and the stable
  sort keeps them in README order, the colored-square fallback renders, the tag
  row doesn't render, and the "Personal" badge sits flush right where dated rows
  show a date. `shortDesc` = README blurb, `description` = GitHub repo
  description. `ProjectsIndex.tsx` swapped the status filter (`Filter`/`FILTERS`,
  All/Personal/Hackathon pills) for a group toggle: state is
  `ProjectGroup | "all"`, the nav renders `[{key:"all",tab:"All"}, ...GROUPS]`,
  and the flat list became `GROUPS.map` → one `<section>` per non-empty group.
  `ProjectRow` untouched. Homepage Lab stack unaffected (renders `featured` only;
  none of the seven are featured).
- **Verification:** Chrome at localhost:3000 — 11 rows across the four groups in
  README order, toggle filters to a single section and back (`aria-pressed`
  tracks), CometAdvisor still expands with its carousel, homepage scrolled end to
  end with the same four Lab cards; ~390px via same-origin iframe (fullscreen
  Chrome still refuses `resize_window`): one-liners/dates hide, toggle wraps to
  two lines, long header wraps. `tsc --noEmit` exit 0. Plan
  `docs/plans/2026-08-13-issue-36.md`; the only deviations were the toggle (owner
  ask) and the `tab` field it needed on `GROUPS`.
- **Left open:** the seven new entries have empty `tags` — per-project tech tags
  would be their own ticket; guessing stacks risked wrong copy.

### 2026-08-10 — robots.txt + sitemap.xml metadata routes (#32)

- **Ask:** serve `/robots.txt` and `/sitemap.xml` so search engines index the
  site properly (pre-launch checklist item; recruiter-searchability).
- **Shipped:** two Next 16 App Router metadata routes, no config changes or
  deps. `app/robots.ts` allows `/`, disallows `/api/` (the contributions proxy
  is a data endpoint, not a page), and points at the sitemap. `app/sitemap.ts`
  lists the two pages: `https://godfreyponce.dev` and `/projects`. No
  `lastModified`/`changeFrequency`/`priority` — no honest data source, and
  Google ignores the latter two. Site URL is a local const in each file,
  matching `app/layout.tsx`'s existing pattern.
- **Verification:** `curl localhost:3000/robots.txt` and `/sitemap.xml` both
  returned exactly the expected output (no visual surface, so no Chrome pass);
  `tsc --noEmit` exit 0. Plan `docs/plans/2026-08-10-issue-32.md`, followed
  with zero deviations.

### 2026-08-03 — Featured Lab stack + /projects index page (#30)

- **Ask:** homepage Lab stack shows only hand-picked `featured` projects plus a
  "See all projects" button; new `/projects` page lists every project newest
  first with All/Personal/Hackathon filter chips and expand-in-place detail.
- **Design locked from previews** (owner picks, spec in issue #30's final
  comment): Variant A index rows, tag T1 (violet/sky pills — existing Badge
  tones), date D1 ("Mar 2026" short form), expanded E3 (full-width 3:2 media
  carousel, meta bar underneath). Preview files `public/preview-a/a2/b/c/d.html`
  deleted after wiring.
- **Shipped:** `lib/projects.ts` gained `shortDesc` (required) + `featured`
  fields on `Project` (all 4 projects featured for now, so the homepage stack is
  unchanged today), exported `techIcons` (moved out of ProjectCard), and
  `projectsNewestFirst()` / `shortDate()` helpers. New `app/projects/page.tsx`
  (server, metadata) renders new client component
  `components/sections/ProjectsIndex.tsx`: rows own their open state, reuse
  `Badge` + `MediaCarousel` (TechAssist gets a one-item YouTube carousel from
  its `videoUrl`), AnimatePresence height expansion with reduced-motion guard.
  Row pill copy says "Personal" for `status: "project"` (homepage cards still
  say "Project"). `TheLab.tsx` filters to featured and adds a centered
  "See all projects (4)" button. Radius shipped as token `rounded-md` 8px, not
  the spec's literal ~6px.
- **Verification:** Chrome at localhost:3000 — row order/pills/dates correct,
  chips filter (Personal → Remix only), E3 expansion with working carousel and
  YouTube embed, hover wash + chevron rotation, mobile (~420px via iframe:
  one-liners/dates hide, meta stacks), homepage button navigates, no console
  errors; `tsc --noEmit` exit 0. Fullscreen Chrome windows refuse
  `resize_window` — narrow-viewport checks used a same-origin iframe instead.
- **Owner-owns-copy note:** Nudge + TechAssist `shortDesc` are agent drafts;
  expanded `description` fields still carry pre-2026-07-17 em dashes.

### 2026-08-02 — Silktide logo tag on the Web Specialist role (#29)

- **Ask:** add a Silktide logo to the Web Specialist tag row, same TechTag
  pattern as #28. Direct owner request; no variant round needed (extends the
  established #28 pattern).
- **Shipped:** `public/logos/silktide.svg` vendored from silktide.com's own
  favicon SVG (simple-icons has no Silktide slug, CDN 404s) — stripped the
  favicon's dark-mode `<style>` block down to a static brand-purple
  `fill="#533BE2"` to match the other 12 logos' format. Added a `Silktide`
  entry to `TAG_LOGOS` and appended the tag to the Web Specialist
  `TimelineItem` in `Timeline.tsx`.
- **Verification:** live site shows it as the 7th icon after Dreamweaver,
  "Silktide" tooltip on hover, SVG loads (naturalWidth > 0); `tsc --noEmit`
  exit 0. Note: programmatic `window.scrollTo` from the JS tool was reset to
  0 on this page — real wheel-event scrolls via the computer tool worked.

### 2026-08-02 — Timeline tags as tech logos with hover tooltips (#28)

- **Ask:** replace the gray text tag badges under the Work Experience entries
  with the actual technology logos, showing the tool's name in a tooltip on
  hover. Spun out of #27's tag-style exploration.
- **Owner picked VARIANT B** (bare logos in full brand color, no chip borders)
  from the 3-variant preview (`public/preview-tech-tags.html`, deleted after
  the pick) over (A) monochrome silhouettes inside the existing chip outline
  and (C) grayscale logos that colorize on hover.
- **Shipped:** 12 SVGs vendored into `public/logos/` — 9 from the simple-icons
  CDN (pre-filled with brand color; note the slug is `css`, not `css3`) plus
  3 from Wikimedia Commons for logos simple-icons dropped or never had
  (Tableau, Dreamweaver, Keynote; the Tableau glyph shipped unfilled so brand
  orange #E97627 was stamped onto its root element). New
  `components/ui/TechTag.tsx`: 20px img, lifts 2px on hover, CSS-only tooltip
  (opacity transition) on `group-hover` and `group-focus-visible`, wrapper
  `tabIndex={0}` for keyboard reach, label as alt text for screen readers.
  `Timeline.tsx` gained a module-scope `TAG_LOGOS` lookup mapping each tag
  string to logo entries: `HTML/CSS/JS` renders as three icons (HTML5, CSS,
  JavaScript), `iOS/macOS` as the Apple logo. Unmapped tags fall back to the
  old text `Badge` (kept import), and the `tags` arrays on the five
  `TimelineItem` calls are untouched. Touch devices get no tooltip (accepted
  limitation; alt text still serves assistive tech).
- **Verification:** live site showed 14 logos (Web Specialist 6, Wayfair 5,
  Apple 3), Handshake + GDSC rows unchanged, tooltip on hover and on
  Shift+Tab keyboard focus, Details toggle still expands/collapses, full-page
  scroll clean, no site console errors; `tsc --noEmit` exit 0.

### 2026-08-02 — Work Experience redesign: collapsed details + pinned current role (#27)

- **Ask:** collapse each job's bullet points out of sight, move the current role
  (Web Specialist, UT Dallas) to the top, and mark it visually — "Present" in a
  different color. Scope confirmed with owner: click-to-expand (not hidden
  entirely), tags stay visible when collapsed, ONLY Web Specialist gets the
  treatment (GDSC is also "Present" but stays plain), rest keep their old order.
- **Owner picked VARIANT A** (quietest: timeline unchanged, only "Present"
  accented) from the 3-variant preview (`public/preview-experience.html`, deleted
  after the pick) over (B) a tinted current-role card with pulsing pill and
  (C) a Currently/Previously split. Round-2 tweaks from owner: forest green
  instead of the orange accent, "Details" hover turns the same green and the
  chevron nudges down. Tag-style variants (dark pills / green pills / outline
  pills) were also shown; owner kept the current gray badges and spun the
  logo-tags idea into #28 (not green-lit).
- **Shipped:** `components/sections/Timeline.tsx` became a client component
  (useState per item); bullets sit in a `grid-rows-[0fr→1fr]` sliding panel
  behind a "Details" button (aria-expanded, chevron rotates when open,
  `group-hover:translate-y-1` nudge); Web Specialist entry moved first with a
  `present` prop that renders "Present" in the new `--color-accent-green`
  token (#2d6a4f, added to `globals.css`). Tags moved above the toggle so they
  stay visible collapsed.
- **Verification:** clicked through the section at localhost:3000 (order, green
  Present, hover, expand/collapse all match the approved preview);
  `tsc --noEmit` exit 0.

### 2026-07-30 — Snapchat-style streak number font (#26)

- **Ask:** the big current-streak number next to the 🔥 should match Snapchat's
  streak counter (Avenir Next Bold). Scope confirmed with owner: ONLY the big
  number; the "longest N" text keeps the site sans.
- **Owner picked VARIANT B** (Nunito Sans ExtraBold, bundled webfont) from the
  3-variant preview (`public/preview-streak-font.html`, deleted after the pick)
  over (A) the Apple-only Avenir Next system stack and (C) Montserrat Bold.
  B is the closest cross-platform clone of the Avenir look and renders
  identically for every visitor.
- **Shipped** (commit `92cacff`): `app/layout.tsx` loads Nunito Sans via
  next/font as `--font-nunito-sans`; `app/globals.css` exposes it as the
  `--font-streak` theme token (font-streak utility); in `ProjectStack.tsx`'s
  `StreakLine` the big number's span swapped `font-display` for
  `font-streak font-extrabold tracking-[-0.01em]`. Size (17px), color,
  tabular-nums, sr-only text, and the #22 hover count-up all untouched.
- **Note:** Nunito Sans loads as a variable font, so the woff2 covers the full
  weight range rather than just the 800 cut (still one small latin-subset file).
- **Verification:** computed style on the live element showed Nunito Sans /
  weight 800 / 17px / -0.17px letter-spacing; zoom screenshot matched the
  Snapchat reference; `tsc --noEmit` exit 0.

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

- **Hero tagline** (`components/ui/ScrambleText.tsx`) — per-letter spans; the letter under
  the cursor snaps to a random color from a 4-hex palette and eases back over 1s, leaving a
  decaying trail. Handlers write/clear `--scramble-color` inline (no state); `.scramble-*`
  rules in `globals.css` live entirely inside `prefers-reduced-motion: no-preference`, so
  `reduce` gets static text and no pointer cursor. `sr-only select-none` sibling carries the
  sentence for AT without doubling it in the clipboard.
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
- Verifying a React hover effect from browser automation: **dispatching a synthetic
  `mouseenter` (or `mouseover`) does NOT fire React's `onMouseEnter`** — React delegates
  enter/leave at the root and the handler never runs, so the effect reads as broken when it
  is fine. Drive it with a real cursor (`computer` → `hover`) instead. Related: assigning
  `element.innerHTML` inside a React-rendered subtree recreates those nodes outside the fiber
  tree, silently killing their handlers for the rest of the page's life — reload after any
  such probe. Both cost a round of false negatives on #37 (2026-08-16).
- Timing a CSS transition from automation: the tool round-trip is longer than a ~1s
  transition, so `transitionrun`/`transitionend` listeners and `getAnimations()` polls both
  come back empty after the fact. Exercise the rule in ONE call on a throwaway element
  carrying the same class (set the var → flush via `getComputedStyle` → clear it → read
  `getAnimations()`), then scrub `currentTime` to sample the curve.
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
app/not-found.tsx                     custom 404; nf-* keyframes live in globals.css
components/NotFoundCounter.tsx        404 count-up (client child of not-found.tsx)
components/StickmanRunner.tsx         scroll-buddy stickman (self-contained)
components/canvas/LossGraph.tsx       ghost-runs training divider (self-contained)
components/sections/TheLab.tsx        async server component; fetches contributions
components/sections/ProjectStack.tsx  sticky stack + StackedCard math + GitHubTile + Heatmap
components/sections/ProjectCard.tsx   grid|stack variants; techIcons map; upward expander
components/ui/MediaCarousel.tsx       all-mounted crossfade carousel; fit:"contain" backdrop
components/ui/SingleLightbox.tsx      Lab enlarge overlay (#64): one picture, no paging
lib/projects.ts                       project data (11 projects, GROUPS sections)
lib/github.ts                         getContributions() server fetch, 6h revalidate
public/tech/*.svg                     brand-colored tag icons
public/projects/**                    upscaled media (originals in git history pre-ce61d11)
```
