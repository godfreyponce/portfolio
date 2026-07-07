# Claude Instructions for personalWebsite

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
