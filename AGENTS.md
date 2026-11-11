# STATE.md's head names the ticket. Start there.

`STATE.md` opens with a YAML head. **`next_action` names the issue that is up now** — go straight
to it. Do not read the issue list and decide for yourself what's important; the owner has already
decided, and that is what the field is for. Below the head, STATE.md is a thin snapshot: what's
mid-flight, how to run/verify, and the gotchas that have already bitten. The full build archive,
file map, and per-feature detail live in `docs/HISTORY.md`.

**The work queue is GitHub Issues** (`gh issue list`). The `ready-for-agent` label means the issue
has its four template sections filled in **and** the owner has green-lit it — that's the eligible
pool. `next_action` picks one out of it. A ticket also isn't ready unless it is **buildable in one
fresh session** inside the lean-window target — too big means split it before green-lighting.
Anything unlabeled still needs owner confirmation before starting. Reference issues in commits
(`refs #N`).
⚠️ This repo is PRIVATE today, but still never commit env values, credentials, or secrets.
Note: `shared_memory.json` (tracked, personal-profile data) means the git history needs a
scrub review before this repo could ever flip public.

# One ticket = two sessions

Planning and building do not share a window. A context that has read the issue, explored the code,
and written a plan is a **poor context to then write the code in** — so the plan goes to a file and
a fresh session builds from it.

- **`/plan-ticket [#N]`** — read the ticket, write `docs/superpowers/plans/YYYY-MM-DD-issue-N.md`,
  stop. No code. The owner reads the plan (**gate 1** — cheap; nothing is built yet).
- `/clear`
- **`/build-ticket [#N]`** — build from the plan file, verify in the running site, **paste the real
  `tsc` output**, stop before landing anything on main. Multi-task plans build on a ticket branch
  with one commit per approved task; single-task plans stay uncommitted in the working tree. The
  owner reads the diff (**gate 2**).
- On the owner's accept: land the code (merge the branch, or commit the working tree), then a
  docs commit; push both together, close the issue, `/clear`.

Planning and reviewing spend judgment; building from an approved plan mostly spends execution, so
the build session can run a cheaper model. The plan's constraints are what keep a cheaper builder
in bounds; a build that keeps failing gate 2 means the plan was under-specified first, the builder
too weak second.

# STATE.md is written exactly once per ticket

**In the accept-time docs commit, after the owner accepts. Never mid-session.**

Continuous updates are what makes this file drift and bloat, because a session writes it from a
context already full of its own work, and it ends up recording things the owner never accepted.
One write, at the seam:

- **Mid-session discoveries never touch STATE.md** → `gh issue create` immediately. The issue queue
  is the capture buffer (write anytime, cheap); STATE.md is the accepted-state snapshot (write once).
  Nothing is lost if a session dies — the plan file, the branch, and the issue all outlive it.
- **Acceptance lands as code commits + one docs commit, pushed together**: the code first — the
  ticket branch's per-task commits merged, or a single `type(scope)` commit for single-task
  tickets — then one docs commit carrying `STATE.md` (Now cleared of the finished item,
  `next_action` advanced to the next ticket, `last_worked_on` bumped) and the feature's section
  in `docs/HISTORY.md`. Then close the issue.
- **"Now" holds unaccepted work only.** The moment the owner accepts something it moves to
  `docs/HISTORY.md`. Keep "Now" under ~6 lines. Gotchas stay in STATE.md — they're the memory that
  earns its place — but a gotcha lives there only while it would still bite an agent working today.

# Session hygiene — keep the window lean (owner rule, 2026-07-12)

Target **≤140k tokens of working context per session.** This works because state lives
OUTSIDE the conversation: `STATE.md` (snapshot), GitHub Issues (queue), `docs/HISTORY.md`
(archive). Suggest a fresh window at natural seams — phase acceptance, plan approval, deploy —
rather than letting a session balloon; a decision that lives only in conversation memory doesn't
exist, so write it to the right file the moment it's made.

# Verification scope

There is no test suite here. Verification is the running site plus the type checker.

- **While iterating, check only what you touched** in the browser. `npx tsc --noEmit` runs **once,
  at the end** of `/build-ticket` — not in a loop, and never as a substitute for looking at the
  page. No `npm run build` to verify changes; no `npm install` unless the owner asks.
- **At most one dev server per worktree, on a free port, stopped by whoever started it.** The
  session that builds the ticket may start it (under `/rt`, that is the build subagent); helper
  subagents it spawns may not.
- **Stop what you started.** Kill any dev server you launched before ending the session, and kill
  it when you stop for gate 2 — do not leave it running while the owner reads the diff.

The full check. **Paste the real `tsc` output**, not a claim about it. `<port>` is 3000 plus the
issue number (3077 for #77), or the next port up if another worktree has it.

```bash
lsof -ti tcp:<port> -sTCP:LISTEN          # must print nothing: the port is free
npm run dev -- -p <port>                  # this worktree's one dev server, http://localhost:<port>
npx tsc --noEmit                          # ONCE at the end of the change, not in a loop
kill $(lsof -ti tcp:<port> -sTCP:LISTEN)  # stop only your server, by its PID
pgrep -fl "$PWD/node_modules/"            # must print nothing: this worktree's server is gone
```

Never stop a server by name, as in `pkill -f "next dev"`: the name matches every worktree's server.

Check the change visually via Chrome automation at localhost:<port> (scroll the whole page).

# Question tickets — mapping decisions

Most tickets are work orders: the deciding already happened before `ready-for-agent` went on.
When a decision is still open, it gets a ticket of its own rather than being guessed at inside
a build:

- **A pinned map issue** names the destination and holds the decision list — one line per
  answered question — plus a **Fog** section: decisions the owner can see coming but can't
  phrase as a question yet. Fog costs one line to park and, unlike a premature ticket, has
  nothing to go stale.
- **The `question` label** marks a ticket that holds one open decision, not work. Its body
  says what the question is and what answering it unblocks. Question tickets are exempt from
  the four-section agent-task template.
- **`Blocked by #N`** as the first body line of any ticket — question or work — that waits on
  an open question. The frontier, what the owner can take today, is every open ticket with no
  open blockers. Answering a question closes its ticket, adds a line to the map, and usually
  turns some fog into new question tickets.
- **One question per session**, same rhythm as build tickets. The answer and its reasoning are
  written on the ticket at close — the ticket does for a decision what the plan file does for
  code.
- **Regenerate the map when a ticket closes** — question or work, either kind:
  `node ~/Developer/tools/decision-map/decision-map.mjs godfreyponce/portfolio --out docs/decision-map.html`.
  Read-only (it only reads `gh issue list`) and it writes one self-contained HTML file, so it
  rides along in the accept-time docs commit and the picture in the repo never lags the queue.

# Visual rule

Anything visual gets 3 single-file HTML variants first; the owner picks; the winner gets wired in.
Three variants means three shapes — a second flavor of the first shape doesn't count. Variants go
in `public/` as throwaway files `preview-a.html`, `preview-b.html`, `preview-c.html` (each works at
localhost:3000/preview-a.html AND via file://); the winner is wired into the real components; then
DELETE all three preview files — they are never committed. Confirm understanding before executing.

# Commit format

`type(scope): summary (refs #N)`. Trailers: the harness default `Co-Authored-By` line, nothing
else. No commit hook. The accept-time docs commit also carries the regenerated decision map (see
"Question tickets"):

```bash
node ~/Developer/tools/decision-map/decision-map.mjs godfreyponce/portfolio --out docs/decision-map.html
```

# Shipped copy

Owner rule (2026-07-17): **NO middle dots (·) and NO em dashes in shipped copy.** This covers
anything a visitor reads on the site. It does not apply to these internal docs.

# Project rules

Personal portfolio website built with Next.js 16, React 19, Tailwind v4, and Framer Motion.

- One dev server per worktree (see `# Verification scope`), and never `next build` and `next dev`
  at the same time in one worktree. Other worktrees' servers belong to their sessions: leave them.
- After large refactors, clear the Next.js cache if builds behave unexpectedly: `rm -rf .next`.
- TypeScript errors are expected during active refactoring — do not spam `tsc` to check, and do
  not run type checks in a loop.
