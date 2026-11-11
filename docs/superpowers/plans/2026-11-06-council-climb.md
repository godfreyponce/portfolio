# Council climb: UI polish before prod

Owner decisions, 2026-11-06. Source idea: Theo's "Agents sucked at UI until today"
(https://www.youtube.com/watch?v=xq0eB8vxeqk) and the council skill at `t3dotgg/tstack/skills/council`.

## Decisions

1. **Order: pick, then climb.** Stage 1 shows the current site with arrows on what is wrong, beside
   3 rough variants. The owner picks one. Stage 2 climbs that one. Stage 3 shows the final beside
   the current site, and the owner says ship or not.
2. **Council: 2 seats.** Claude Opus 5.5 and GPT-6.1 Sol, both at high effort. The skill asks for 3
   providers; the owner chose 2 because only Claude and Codex are enabled in T3.
3. **Stop:** both members score 9/10 or higher, or 7 rounds, whichever comes first. At 7 rounds
   without a pass, stop and report the scores and what is still wrong.
4. **Scope: #53's decisions hold.** Structure and content stay. cmrg.me sets measured values,
   genesiating.com sets imagery and density, the ground stays light, and the bio folds into the
   hero. `public/godfrey_portrait.jpg` (586x879, 2:3) meets #53's portrait requirement.
5. **Where:** stage 2 runs in a new thread under the T3 project personalWebsite, started after the
   owner picks a variant.

## Stage 1 result and changes (2026-11-07 to 2026-11-09)

Stage 1 built `public/preview-review.html` (arrows 1 to 24 on the live site) and variants
`preview-a/b/c.html`. All uncommitted, all throwaway.

6. **The hero is frozen.** The owner: "do not touch this part". It stays exactly as live today:
   round headshot with its white ring and shadow, name, tagline, and the GITHUB / LINKEDIN / EMAIL
   row. Screenshot: `2026-11-09-hero-frozen.png` beside this file. This overrides decision 4's bio
   fold and rectangular portrait, and drops arrows 1, 17 and 19. #60's hero choice stands.
7. **Variants A, B and C are rejected as generic.** The owner judged A generic; C needs the
   portrait cover, which decision 6 rules out. Cause: #53's brief copies cmrg.me's restraint, which
   pulls every variant toward the same quiet template.
8. **Next: a new round of 3 variants for everything below the hero**, briefed to be recognisable
   as the owner's, not to match cmrg.me.

## Answers for the new round (2026-11-09)

9. **What makes it his: all four.** Live data (GitHub heatmap, streak, loss graph), soccer, agents,
   and the stick figure. Each of the 3 variants gives them different roles.
10. **Type sizes below the hero: keep #62/#63's** (27px h1 ramp, 13px section labels). cmrg's sizes
    are not applied.
11. **GitHub heatmap keeps its colour.** It may be the one spot of colour on a neutral page.
12. **Portrait: settled without asking.** The largest source in the repo is
    `public/godfrey_headShot.JPG` (1000x879), so a 2:3 crop caps at the 586x879 already there. The
    hero is frozen, so no variant uses the portrait.

## Round 2 result (2026-11-09)

Round 2 replaced `preview-a/b/c.html` with A Training run (loss-curve rail), B Match day
(full-bleed soccer bands) and C Workbench (sticky live-data rail), each under the frozen hero.
`preview-review.html` shows them and has arrows 1, 17 and 19 removed. Round 1's files are not kept
in the repo.

13. **Round 2 is rejected as "too generic AI".** The owner: genesiating.com "is more intentional
    from a design perspective". Each variant hung a theme on the page (training run, match day,
    workbench), and a theme is not design intent. Round 3 does not add metaphors.
14. **The hero is reopened, which reverses decision 6 until the owner rules on it.** The owner
    wants to see the genesiating opening again: a rectangular portrait on the left
    (`public/godfrey_portrait.jpg`, 586x879), with name, tagline, the two bio paragraphs, an
    outlined "send me an email" button and a LinkedIn icon on the right. Reference: genesiating's
    hero, screenshot `public/preview-assets/genesiating-1440.png`. Round 3 shows this hero beside
    the frozen one, so the owner can choose.
15. **Round 3 direction: genesiating's feel across the whole page.** Measure genesiating first
    (#53's audit table, the reference screenshots in `public/preview-assets/`, and the live site).
    The measurements cover type, spacing, column, image sizes and density. Brief the variants from
    those numbers, not from motifs. Three shapes still apply (Visual rule), and each one is a
    different reading of genesiating's intent, not three themes.

## Round 3 result (2026-11-10)

Round 3 rebuilt `preview-a/b/c.html` as A Index, B Split and C Plates, each opening with a
genesiating-style hero. `preview-review.html` section 3 sets the frozen hero beside the new one,
and section 4 holds the variants. Measurements: genesiating.com live at 1440x813. Its type grows
with window height. At 1440x813 its name is 29.27px and body 15.22px, which are the site's shipped
#62/#63 sizes. Column 956px, portrait 372x558, gutter 48px. Round 3 tools, all in
`/private/tmp/claude-501/-Users-geovponce-Developer-personalWebsite/9f0c512a-3dc3-431a-8b4d-38cd3324b7f5/scratchpad/`:
`hero-g.html` (the hero as a drop-in snippet), `round3-brief.md` (the measured brief),
`cdp-measure.mjs` + `measure.js` (headless measuring), `gen-1440.json` (the raw measurements).

16. **The genesiating hero wins, which ends decisions 6 and 14.** The owner pointed at A's top
    (hero, stick figure, the "Where I've worked and studied" logo strip): "I actually really like
    this". Changes to the hero: remove the SEND ME AN EMAIL button. The icon row sits left,
    LinkedIn first, then GitHub. Email comes back in a new form: "follow genesiating, but not
    one-to-one, add my own flair". The next round shows variants of the email treatment.
17. **The page is now built section by section, not as whole pages.** The Lab waits.
18. **Next batch: Work Experience, Education and the loss graph**, 3 variants under the Visual
    rule. Work Experience must show the org logos and the stack icons (tech marks in
    `public/tech/` and `public/logos/`). Each of the 3 also carries one email treatment from
    decision 16, so the owner picks both in one pass. Open for that session: with logos inside
    the job entries, does A's logo strip stay under the hero? Ask before building.
    Section heads stay genesiating's italic serif with a » unless the owner says otherwise; the
    round 3 closing flagged that this departs from decision 10.
19. **The logo strip under the hero stays** (2026-11-10, decision 18's open question). The job and
    education entries repeat each logo beside their own entry.

## Round 4 result (2026-11-10)

Round 4 rebuilt `preview-a/b/c.html` as A List, B Cards and C Grid (Work Experience, Education
and the loss graph only, under the decision 16 hero). `preview-review.html` sections 3 and 4
describe them. Builder: `build.py` in
`/private/tmp/claude-501/-Users-geovponce-Developer-personalWebsite/613a1983-2b58-443e-8c50-ce073d2b3a27/scratchpad/`
(it builds the shared top from `round3-preview-a.html` there; edit the A_* parts and rerun
`python3 build.py`, never with `--snapshot` again).

20. **A wins, with A's email** (the address in mono after the hero icons, with "copy"). Changes
    for the next build, all on preview A:
    - Hero bio: the link text "UTD" becomes "UT Dallas". Keep the dashed underline the hero
      links have now; the owner likes it.
    - Hero "Soccer" link: on hover the cursor becomes a soccer ball icon. Click scrolls smoothly
      to `#soccer`. Add a plain soccer stub at the bottom of A as the target: the photo
      `godfrey_soccerShot.jpg` and its caption from `Passions.tsx`. Passions replaces it later.
    - Logo strip: hovering a logo shows it in colour and also shows that entry's hover effect
      in Work Experience or Education (its stack icons turn to colour). Clicking a logo scrolls
      to that entry and briefly pops it (a short highlight, then back). Honour reduced motion.
    - Verb tense: Handshake "Conducting" becomes "Conducted", Wayfair "Developing" becomes
      "Developed". Check every other first bullet for the same fix.
    - Loss graph: no caption. The graph sits under its rule with only its readout.
    - **Open, needs 3 variants (Visual rule):** in A's job list, the org and role line and the
      description under it read the same. The owner wants to see 3 ways to tell them apart
      before picking. Ideas offered so far: grey description (#78716c); the role on its own line
      in the serif at 17px; a smaller grey description at 13.5px. Build these as
      `preview-a/b/c.html` (each is A with all the changes above and one fix), and show them in
      `preview-review.html`.

## Round 5 result (2026-11-10)

Round 5 built A with decision 20's changes in 3 title fixes. Builder: `build5.py` beside
`build.py` (same scratchpad; `build.py` is untouched). It writes `preview-a/b/c.html` and leaves
`preview-review.html` alone; sections 3 and 4 of that page describe round 5.

21. **C wins: the small grey description** (13.5px, #78716c, org and role line at body size).
    The owner does not like the soccer ball cursor. `build5.py` now writes 3 ball treatments, each
    on top of C: A a redrawn ball cursor, B the normal arrow with a small ball beside it, C no
    custom cursor, a small ball rolls in after "Soccer" on hover. The owner then asked for a real
    picture, so all 3 use the ball cut from `godfrey_soccerShot.jpg` (`ballphoto-raw.jpg` in the
    same scratchpad), not a drawing. The owner: the photo ball "looks fake" (a 96px crop of a
    blurred ball in motion). Drawn and photo balls are both rejected. Open: what the Soccer link
    shows on hover, if anything.
22. **The Soccer cursor is the device's own ⚽ emoji** (2026-11-10), drawn in a 32px SVG cursor.
    It looks different on each OS; the owner accepted that. `build5.py` now writes one page,
    `preview-a.html` (C plus the emoji cursor); `preview-b/c.html` are deleted. Next: the next
    section, in a fresh session, built on `preview-a.html`. After the
    pick, wire the winner into `build5.py` as the only output, then go to the next section in a
    fresh session (the window passed 140k here).

## Round 6 result (2026-11-10)

Round 6 built The Lab in 3 shapes on the decision 22 page: A Rows (the Work Experience list),
B Cards (round 3's 3-up cards with stack icons), C Lead (LAND large, 4 in a row, a 52-week
heatmap band). `build5.py` (same scratchpad) now writes `preview-a/b/c.html`; the round 5 page
is saved beside it as `round5-final-preview-a.html`. The heatmap and streak numbers are fixed
values from 2026-11-09. The live subtitle under "The Lab" is dropped in all three.

23. **The owner wants to see the live Lab on this page** (2026-11-10). The "See all projects"
    button stays. The Lab itself is the one on the live site: the scroll stack in
    `components/sections/ProjectStack.tsx` (`StackedCard`) with `ProjectCard.tsx`'s
    `variant="stack"` cards and their thumbnails. Port it faithfully to inline CSS and JS: each
    card is 440px tall and `position:sticky` at `top: calc(7vh + index*12px)`, the stack is
    900px wide with a 10vh gap, and as you scroll each card scales from 1 to
    `1 - (total-1-index)*0.04` (scroll progress from `index/total` to 1, over the stack's
    "start start" to "end end") with a cream veil (`bg-surface`) fading 0 to 0.45 between
    `index/total` and `(index+1)/total` (the last card gets no veil). The GitHub tile is the
    last card, with the streak row under it. Under 768px or with reduced motion it falls back to
    the live grid (LAND full width, then 2 columns). Build it as `preview-d.html` from
    `build5.py`, and keep A/B/C so the owner can compare. The cards keep the live card look (the
    owner: "like the one I have on my website currently"); restyling them is a later call. Read
    `ProjectCard.tsx` before building; it was not read in round 6.

## Round 7 result (2026-11-10)

Round 7 built `preview-d.html` from `build5.py` (same scratchpad): the decision 22 page with the
live Lab ported to inline CSS and JS. Card content is read from `lib/projects.ts` at build time.
Checked in Chrome: stack scales 0.80 to 0.96 at full scroll, veils reach 0.45 (none on the last
card), grid fallback at 390px with no sideways scroll, carousel and "View project" popover work.
Not ported: carousel mouse drag and the click-to-enlarge lightbox.

24. **D wins: the live Lab stays as it is** (2026-11-10). `build5.py` now writes only
    `preview-d.html`; `preview-a/b/c.html` are deleted from `public/` and kept in the scratchpad as
    `round6-preview-a-rows.html`, `round6-preview-b-cards.html` and `round6-preview-c-lead.html`.
    Still open, for a later call: "See all projects" is left-aligned in the 956px column, 28px left
    of the centred 900px stack (the live site centres it). Next: the next section, in a fresh
    session, built on `preview-d.html` (the window passed 140k here).
25. **Three Lab fixes accepted** (2026-11-10), all in `build5.py`, on preview-d only (the live
    site is unchanged; backup `build5.pre-r8.py.bak` in the same scratchpad).
    - LAND's first slide did load (Chrome: `complete`, naturalWidth 1500, before and after
      scrolling). It read as black because the photo is dark (mean luma 43/255) and `cover` in the
      495x440 frame cropped "LAND" to "ND", "Are you okay?" and the box inset. Owner pick: show
      the whole photo, `fit: contain` over its blurred copy (as the architecture slide). Slide
      order unchanged. Live wire-in: add `fit: "contain"` to that item in `lib/projects.ts`.
    - LAND's card shows its `shortDesc`; the full `description` stays on /projects. LAND only,
      the other four already fit the 440px card. Live wire-in needs the same in `ProjectCard.tsx`.
    - The status tag ("Hackathon", "Sprint") is plain text: no border, padding or radius
      (review finding 9). The tech-chip badges keep their border.
    - The owner: keep the project logos as they render now (40px, `object-contain`, 4px radius,
      as the live `ProjectCard.tsx`); never put them in a circle, which cuts the L and N of LAND.
    Next: Passions, the section after The Lab, built on `preview-d.html`.
26. **Passions: 3 shapes on preview-d** (2026-11-10). `build5.py` writes `preview-a/b/c.html`
    (each is D with one Passions in place of the soccer stub) and keeps `preview-d.html`.
    A List (a "Passions »" head, the soccer photo, then three entries written like Work
    Experience), B Plate (the soccer photo large, Snowboarding and Home Lab as two short notes
    beside it), C Tiles (the live three tiles reworked for this page, captions under the image,
    not on it). Snowboarding and Home Lab are text only, no drawn art, since the only real photo is
    `godfrey_soccerShot.jpg`. The live subtitle "Beyond my Mac" is dropped. Copy is the live
    `Passions.tsx` text. The hero "Soccer" link keeps scrolling to `#soccer`.

## Round 8 result (2026-11-10)

Round 8 built Passions as `preview-a.html` (List), `preview-b.html` (Plate) and
`preview-c.html` (Tiles), each preview-d with the soccer stub replaced; `preview-d.html` is
unchanged. In C, the two text-only tiles carry their title in large italic serif (Snowboarding on
cream, Home Lab on the dark tile, as live), with the label and text under them. Checked in Chrome
at desktop and in a 390px frame: one column, no sideways scroll, the hero "Soccer" link reaches
`#soccer` in all three.

27. **B wins: Passions is the Plate** (2026-11-10). `build5.py` now writes only `preview-d.html`,
    which is the decision 25 Lab plus Passions B (title "Preview D: Live Lab and Passions").
    `preview-a/b/c.html` are deleted from `public/` and kept in the scratchpad as
    `round8-preview-a-list.html`, `round8-preview-b-plate.html` and `round8-preview-c-tiles.html`.
    Still open: "See all projects" alignment (decision 24). Next: the footer, or stage 3 if the
    owner calls the page done, in a fresh session built on `preview-d.html` (the window passed
    140k here).
28. **Next: the footer** (2026-11-10). The owner chose option A over stage 3: build the footer,
    the last section below Passions, as 3 shapes (`preview-a/b/c.html` from `build5.py`, each
    preview-d with one footer added), keeping `preview-d.html`. Confirm the understanding with
    the owner before building. preview-d has no footer today; the live one is
    `components/sections/Footer.tsx` (dark, sticky, name linking to `#top`, GitHub, LinkedIn and
    email icons, then the latest-commit line and "© Godfrey Ponce").
29. **Footer: 3 shapes confirmed** (2026-11-10). Each goes at the very bottom of preview-d, under
    Passions; `preview-d.html` itself stays unchanged. A Dark reveal (the live dark sticky footer
    fitted to this page: name links to `#top`, GitHub, LinkedIn and Email as text links with the
    real handle in gray under each, a rule, the commit line and "© Godfrey Ponce"; cmrg.me does
    the same reveal). B Last section (a light "Contact »" section in the column, the email large
    with its copy button, GitHub and LinkedIn as text links, a hairline row with the commit line
    and ©; the page ends on text, as genesiating.com). C One line (no socials, since the hero has
    them: "© 2026 Godfrey Ponce", the commit line and "Back to top" in small mono). Copy only from
    the live footer; the commit line is a fixed sample ("lines changed today: +120 -34"), since a
    static file cannot call `/api/latest-commit`.

## Round 9 result (2026-11-10)

Round 9 built the footer as `preview-a.html` (Dark reveal), `preview-b.html` (Last section) and
`preview-c.html` (One line) from `build5.py` (backup `build5.pre-r9.py.bak`). Each is preview-d
with the 100px end spacer dropped and one `<footer>` after `</main>`; `preview-d.html` has no
footer and is unchanged. Links to `#top` in the footer scroll smoothly, as the Soccer link does.
Checked in Chrome at 2096px wide (the window could not be resized to 1440) and in 390px frames:
A pins to the bottom and the page slides off it, B's copy button shows "copied" on a real click,
C's "Back to top" reaches the top, and none of the three scrolls sideways at 390px. One fix
during the check: A's link list had the browser's 40px list indent.

30. **A wins: the footer is the Dark reveal** (2026-11-10). `build5.py` now writes only
    `preview-d.html`, which is the decision 27 page plus footer A (title "Preview D: Live Lab,
    Passions and Footer"). `preview-a/b/c.html` are deleted from `public/` and kept in the
    scratchpad as `round9-preview-a-reveal.html`, `round9-preview-b-section.html` and
    `round9-preview-c-line.html`. The commit line is still the fixed sample; the live
    `LatestCommitLine` fills it on wire-in. Still open: "See all projects" alignment (decision 24).
    Every section now has a pick. Next: stage 3 (decision 1), or more climbing if the owner asks.

## Stage 3 (2026-11-10)

The owner chose to run stage 3 in the same session. A headless Chrome script over CDP
(`shots.mjs` in this session's scratchpad, af2abae1-...) captured the same 7 sections (hero,
work, education, loss graph, The Lab, Passions, footer) of godfreyponce.dev and preview-d at
1440x900 and 390x844 (mobile). Each pair puts live on the left and preview-d on the right, in
`stage3/pairs/`, with the overview sheets `stage3-desktop.png` and `stage3-phone.png`.

Fix found by the comparison: the first capture showed footer A through a strip between the hero
and `main` (from 597px to 687px at 1440x900). `HERO` took snapshot lines 130 to 145, but
`</header>` is line 146, so since round 4 the header was never closed, and `main` and the footer
were parsed inside it, where the dark footer painted over the hero section. `build5.py` now takes
line 146 (backup `build5.pre-s3.py.bak`). Computed font, colour, size, smoothing and line height of
all 1014 elements in `main` and the footer hashed the same before and after. The 2096px Chrome
check in round 9 missed it, because there the pinned footer starts below the top of `main`.

31. **Ship** (2026-11-10). After the side-by-side, the owner said ship preview-d. Shipping means
    wiring it into the real Next.js components through GitHub issues (no `ready-for-agent` label;
    that stays the owner's), then /plan-ticket and /build-ticket per issue. Known gaps that ride
    along into the issues: "See all projects" alignment (decision 24), the live
    `LatestCommitLine` in place of the sample, and the Lab carousel's mouse drag and lightbox,
    which the live site has and preview-d did not port.
32. **Spec home and slicing** (2026-11-10). The spec moves into the repo, uncommitted:
    `build5.py`, the files it reads, and a copy of `preview-d.html` go to
    `docs/superpowers/council-climb/`; the owner decides later whether they are committed. The
    ship is cut now into one issue per section under #53, without `ready-for-agent`: hero and base
    type, Work and Education, The Lab fixes plus "See all projects", Passions plate, dark reveal
    footer. Filed 2026-11-10 as #78 (hero and base type, goes first), #79 (Work Experience,
    Education and loss graph), #80 (Lab fixes and "See all projects"), #81 (Passions plate) and
    #82 (footer). `public/godfrey_portrait.jpg` is untracked and rides in #78.
33. **Run the ship with an orchestrator** (2026-11-10). Each ticket runs /rt in its own worktree,
    gate 1 passes without stopping, gate 2 stops for the owner. Two waves: #78 and #80 now in
    parallel; #79, #81 and #82 in parallel after #78 merges. One chore commit on main (not
    pushed) carries this plan, `docs/superpowers/council-climb/` and the portrait so worktrees
    have the spec; the owner green-lit #78 to #82 and `ready-for-agent` went on at their say-so.
    Builders must not run the full check's `pkill -f "next dev"` (#77): each uses its own port.

## Climb rules

- Nothing reaches production without the owner's yes: no merge to main, no push, no `vercel --prod`.
- Reviewers are read-only and never see the 9/10 target or earlier scores. Theo suspected that
  telling reviewers the target skewed his scores.
- Each review shows the screenshots beside cmrg.me and genesiating.com. A score given with no
  comparison is not used. In Theo's run, a 9/10 fell to 7.4 once comparisons sat beside it.
- A fix must trace to a review finding and stay inside #53's scope. Findings outside it are listed
  for the owner, not built.
- The owner's eye overrides the score at stage 3.

## Results

Scores per round go here during stage 2.
