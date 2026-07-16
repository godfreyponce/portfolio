# personalWebsite — Project State

Personal portfolio site. Next.js 16 (App Router, Turbopack) + React 19 + Tailwind v4 +
Framer Motion. Single page (`app/page.tsx`): Hero → About → StickmanRunner → Timeline →
Education → LossGraph → The Lab → Passions → Footer. Repo: github.com/godfreyponce/portfolio (private).

*Thin snapshot — update continuously as work progresses. Full build archive, file map, and
per-feature detail: `docs/HISTORY.md`. Work queue: GitHub Issues (`gh issue list`). Protocol:
`AGENTS.md`.*

**Last updated: 2026-07-16**

## Now

- **Issue queue is empty** — all accepted work closed. #2 (official Plaid + Nebula tech-tag
  icons) shipped 2026-07-16, owner-confirmed on localhost. #1 (retina screenshots) closed
  2026-07-16: comet/nudge/Godfrey done; remix stack + logo left at current res (no higher-res
  source available). #3–#12 closed earlier.
- Local `main` is ahead of `origin/main` by 2 (#2 feat + this docs commit) — awaiting owner
  push. Earlier retina commits already pushed (through `acea98f`).
- Pre-existing tree items (owner's, don't touch): unstaged deletion of
  `agent_architecture_strategy.md`, untracked `Icon` file.

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
- git (any external binary) can die here with `Operation not permitted` — macOS TCC revoking
  Desktop access, not a repo problem; owner re-allows in System Settings, retry. Prefix git
  with `cd /Users/geovponce/Desktop/personalWebsite;` if paths act weird.
- Signal project was deliberately removed 2026-07-07 (owner) — don't resurrect from git.
- Backgrounded browser-automation tabs get throttled — fire-and-collect JS + screenshots.
