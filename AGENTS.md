# Read STATE.md first, then check the issue queue

`STATE.md` is a **thin snapshot** of right-now state: what's mid-flight, how to run/verify,
and the gotchas that have already bitten. Read it before doing anything. The full build
archive, file map, and per-feature detail live in `docs/HISTORY.md`.

**The work queue is GitHub Issues** (`gh issue list`). The `ready-for-agent` label means the
owner has green-lit that item; anything unlabeled still needs owner confirmation before
starting. Reference issues in commits (`fixes #N`) so they close automatically.
⚠️ This repo is PRIVATE today, but still never commit env values, credentials, or secrets.
Note: `shared_memory.json` (tracked, personal-profile data) means the git history needs a
scrub review before this repo could ever flip public.

**Keep state current as you work, not as an end-of-session dump:**
- Update STATE.md's "Now" section when what's mid-flight changes; keep the file under ~40 lines.
- New work discovered mid-session → `gh issue create` immediately; don't let it live only in conversation.
- After a feature is built **and the owner confirms it's good**: close its issue, refresh
  STATE.md, add the feature's detail section to `docs/HISTORY.md`, and commit them alongside
  the feature. Don't record work the owner hasn't accepted yet.

# Session hygiene — keep the window lean (owner rule, 2026-07-12)

Target **≤140k tokens of working context per session.** This works because state lives
OUTSIDE the conversation: `STATE.md` (snapshot), GitHub Issues (queue), `docs/HISTORY.md`
(archive). Suggest a fresh window at natural seams — phase acceptance, plan approval,
deploy — rather than letting a session balloon; a decision that lives only in conversation
memory doesn't exist, so write it to the right file the moment it's made.

# Visual changes — owner's established workflow

Propose variants (owner rule: 3) as a throwaway HTML file in `public/` (works at
localhost:3000/preview-x.html AND file://), owner picks one, wire the winner into the real
components, then DELETE the preview file. Confirm understanding before executing.

# Project rules

## Project
Personal portfolio website built with Next.js 16, React 19, Tailwind v4, and Framer Motion.

## Before Starting Any Work
- Run `pkill -f "next dev"` to kill any existing dev servers before starting new ones
- Only start ONE dev server at a time
- Do not start multiple builds or dev servers concurrently

## Dev Server
- Start with: `npm run dev` (runs on http://localhost:3000)
- To preview the site, open http://localhost:3000 in the browser — do not spawn additional server processes
- Kill the dev server when done: `pkill -f "next dev"`

## After Large Refactors
- Clear the Next.js cache if builds behave unexpectedly: `rm -rf .next`
- Do not run `next build` and `next dev` at the same time

## Memory / Performance Rules
- Do NOT run multiple Node processes simultaneously
- Avoid running `npm install` unless explicitly asked — node_modules is already installed
- Do not use `npm run build` to verify changes during development — use `next dev` only

## TypeScript
- TypeScript errors are expected during active refactoring — do not spam `tsc` to check
- Do not run type checks in a loop
