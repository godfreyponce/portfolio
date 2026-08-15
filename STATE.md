---
glass: ""
status: in-progress
last_worked_on: 2026-08-14
next_action: "Rewrite #33's body, then green-light it (owner pick 2026-08-14). The ticket says Vercel Web Analytics, which silently no-ops on AWS Amplify, so it cannot be planned as written: pick an Amplify-compatible option first and rewrite the body around it. `docs/plans/2026-08-11-issue-33.md` was drafted against the old body — it is stale, do not build from it, and mark it dead when the new body lands. This is owner-side work, not an agent task: nothing is labeled `ready-for-agent` right now, so the eligible pool is empty until #33 is rewritten and green-lit (or #34, the OG share image, gets its four template sections filled in and green-lit instead)."
blocked_on: ""
phase: "Pre-launch polish. #31 custom 404 page pushed and closed 2026-08-14; #36 /projects grouped into README sections + seven GitHub projects pushed and closed 2026-08-13; #32 robots.ts + sitemap.ts pushed and closed 2026-08-13; #30 featured Lab stack + /projects index page pushed 2026-08-03; LossGraph ghost-runs animation 2026-07-09; scroll-driven stickman, scroll-stacking Lab cards, crossfading carousel, contribution heatmap 2026-07-07. Remaining pre-launch items are #33 (analytics, needs body rewrite) and #34 (OG share image, optional polish)."
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
  `setTimeout` also clamps to ~1s there, so sampling a CSS animation on a short interval aliases
  and reads as frozen; use `document.getAnimations()` and set `currentTime` instead.
- `resize_window` refuses bounds on a fullscreen Chrome window — check narrow widths by injecting
  a same-origin iframe (it gets its own viewport for `vw` and media queries).
- Hosting is AWS Amplify, not Vercel — Vercel-only features (Web Analytics, ISR knobs) silently no-op.
