# personalWebsite — Project State

Personal portfolio site. Next.js 16 (App Router, Turbopack) + React 19 + Tailwind v4 +
Framer Motion. Single page (`app/page.tsx`): Hero → About → StickmanRunner → Timeline →
Education → LossGraph → The Lab → Passions → Footer. Repo: github.com/godfreyponce/portfolio (private).

*Thin snapshot — update continuously as work progresses. Full build archive, file map, and
per-feature detail: `docs/HISTORY.md`. Work queue: GitHub Issues (`gh issue list`). Protocol:
`AGENTS.md`.*

**Last updated: 2026-07-21**

## Now

- **#20 SHIPPED**: bio bubble weight (UTD + Soccer in About.tsx), owner picked
  VARIANT A: transform on an inner wrapper so UTD's tooltip stays anchored;
  Soccer hover color changed to hunter green #355e3b (owner-directed, deviates
  from the plan's keep-accent rule). Reuses `.hover-bubble` from #19, no new
  physics. Commit `9a3a1f1`, owner accepted 2026-07-21. NOT pushed yet, owner
  reviews (`fixes #20` closes the issue on push). Queue is now EMPTY.
  Detail in `docs/HISTORY.md`.
  Owner rule (2026-07-17): NO middle dots (·) or em dashes in shipped copy.
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
