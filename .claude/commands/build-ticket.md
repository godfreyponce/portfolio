---
description: Build a ticket from its plan file, verify it in the running site, and stop before committing.
argument-hint: "[#N] (optional — defaults to the WIP issue in STATE.md's ## Now)"
---

Build one ticket from its plan file. **Start from the plan, not from a conversation you weren't in.**

## Which ticket

`$ARGUMENTS` names the issue if set; otherwise read the WIP issue from STATE.md's `## Now`.
Load `docs/plans/*-issue-N.md`. If no plan file exists, stop — run `/plan-ticket N` first.
Building without the plan is exactly the failure this split exists to prevent.

## Build it

1. Use the `superpowers:executing-plans` skill. Follow the plan task by task.
2. Where the plan turns out to be wrong, **say so** rather than quietly improvising around it —
   a deviation the owner never sees is a deviation they can't catch at review.
3. Verify. There is no test suite here — verification is the running site:

```bash
pkill -f "next dev"      # ALWAYS kill existing dev servers first; only ONE at a time
npm run dev              # http://localhost:3000
npx tsc --noEmit         # ONCE at the end of the change, not in a loop
```

Check the change visually via Chrome automation at localhost:3000 (scroll the whole page).
No `npm run build` to verify; no `npm install` unless the owner asks. **Paste the real tsc
output**, not a claim about it.

## Then stop — before committing

Show the owner the diff and wait. Do not commit, do not push, do not close the issue. Kill the
dev server when done with it.

## Only after the owner accepts

Two commits, and **never push** — the owner reviews and pushes:

- the code: `type(scope): summary (fixes #N)` — `fixes #N` closes the issue when the owner
  pushes it to main,
- `docs: STATE — ...` carrying STATE.md (clear the finished item from `## Now`, bump
  "Last updated") and the feature's section in `docs/HISTORY.md`.

Anything you discovered along the way that isn't this ticket goes to `gh issue create`, not into
STATE.md. Then tell the owner to `/clear` before the next ticket.
