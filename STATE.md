---
glass: ""
status: in-progress
last_worked_on: 2026-08-13
next_action: "#31 custom 404 page — green-lit and labeled `ready-for-agent` 2026-08-13. Plan it in a fresh session (`/plan-ticket 31`). Two things the plan must handle: the body is a three-line note from the 2026-08-10 checklist review, not the four-section template, so scope and done-when have to be proposed rather than read off the ticket; and it is a visual change, so it goes through the variants workflow (three throwaway HTML previews in `public/`, owner picks, delete after wiring). #33 and #34 stay unlabeled — and #33 needs its body rewritten before it can be planned at all, since it specifies Vercel Web Analytics, which silently no-ops on AWS Amplify, and `docs/plans/2026-08-11-issue-33.md` was drafted against that old body, so it is stale and must not be built from."
blocked_on: ""
phase: "Pre-launch polish. #36 /projects grouped into README sections + seven GitHub projects pushed and closed 2026-08-13; #32 robots.ts + sitemap.ts pushed and closed 2026-08-13; #30 featured Lab stack + /projects index page pushed 2026-08-03; LossGraph ghost-runs animation 2026-07-09; scroll-driven stickman, scroll-stacking Lab cards, crossfading carousel, contribution heatmap 2026-07-07. Remaining pre-launch items are the three optional-polish tickets above."
---

# personalWebsite — Project State

Personal portfolio site. Next.js 16 (App Router, Turbopack) + React 19 + Tailwind v4 +
Framer Motion. Single page (`app/page.tsx`): Hero → About → StickmanRunner → Timeline →
Education → LossGraph → The Lab → Passions → Footer. Repo: github.com/godfreyponce/portfolio (private).

*Thin snapshot. `next_action` above names the ticket that is up now — start there.
Archive: `docs/HISTORY.md`. Queue: GitHub Issues (`gh issue list`). Protocol: `AGENTS.md`.*

## Now

- Nothing mid-flight. Map issue #35 is pinned; regenerate `docs/decision-map.html`
  at every ticket close (command in AGENTS.md, "Question tickets").
- Pre-existing tree items (owner's, don't touch): unstaged deletion of
  agent_architecture_strategy.md, untracked Icon file.

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
- Next 16 needs `images.qualities` in `next.config.ts` for non-75 image qualities.
- Signal project was deliberately removed 2026-07-07 (owner) — don't resurrect from git.
- Backgrounded browser-automation tabs get throttled — fire-and-collect JS + screenshots.
- Hosting is AWS Amplify, not Vercel — Vercel-only features (Web Analytics, ISR knobs) silently no-op.
