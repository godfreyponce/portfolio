---
description: Build a ticket from its plan file, verify it in the running site, and stop before landing it.
argument-hint: "[#N] (optional — defaults to STATE.md's next_action)"
---

Build one ticket from its plan file. **Start from the plan, not from a conversation you weren't in.**

## Which ticket

`$ARGUMENTS` names the issue if set; otherwise read `next_action` from STATE.md's YAML head.
Load `docs/plans/*-issue-N.md`. If no plan file exists, stop — run `/plan-ticket N` first.
Building without the plan is exactly the failure this split exists to prevent.

## Build it

1. Use the `superpowers:executing-plans` skill. Follow the plan task by task.
2. If the plan has more than one task, create a ticket branch and commit each task once its
   review passes (`type(scope): summary (refs #N)` per commit). Single-task plans stay
   uncommitted in the working tree. Either way, nothing touches main before gate 2.
3. Where the plan turns out to be wrong, **say so** rather than quietly improvising around it —
   a deviation the owner never sees is a deviation they can't catch at review.
4. Verify. There is no test suite here — verification is the running site:

```bash
pkill -f "next dev"      # ALWAYS kill existing dev servers first; only ONE at a time
npm run dev              # http://localhost:3000
npx tsc --noEmit         # ONCE at the end of the change, not in a loop
```

Check the change visually via Chrome automation at localhost:3000 (scroll the whole page).
No `npm run build` to verify; no `npm install` unless the owner asks. **Paste the real tsc
output**, not a claim about it.

## Then stop — before landing anything on main

Show the owner the diff (the ticket branch, or the working tree) and wait. Do not merge or
commit to main, do not push, do not close the issue. Kill the dev server when done with it.

## Only after the owner accepts

Code commits + one docs commit, pushed together:

- **the code** — merge the ticket branch's per-task commits, or for a single-task plan commit
  the working tree as one `type(scope): summary (refs #N)` commit,
- **then one docs commit** — `STATE.md` (clear the finished item out of `## Now`, advance
  `next_action` to the next ticket — ask the owner which if it isn't obvious — bump
  `last_worked_on`), the feature's section in `docs/HISTORY.md`, and the regenerated map:

```bash
node ~/Developer/tools/decision-map/decision-map.mjs godfreyponce/portfolio --out docs/decision-map.html
```

Then push, close the issue with a one-line result, and tell the owner to `/clear` before the
next ticket.

This is STATE.md's **only** write moment. Anything you discovered along the way that isn't this
ticket goes to `gh issue create`, not into STATE.md.
