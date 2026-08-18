import { NextResponse } from "next/server";

// Latest public commit for the footer status line (#40). Unlike the
// contributions route (deliberately no-store end to end), this one caches
// server-side in module memory: CloudFront froze ISR (#24), so the cache must
// not lean on CloudFront or Next's data cache, and force-dynamic + no-store on
// the response keeps both out of the way while the in-memory TTL keeps the
// unauthenticated GitHub limit (60 req/hour per IP) comfortable.
export const dynamic = "force-dynamic";

const EVENTS_URL = "https://api.github.com/users/godfreyponce/events/public";
const GH_HEADERS = {
  Accept: "application/vnd.github+json",
  // GitHub rejects requests without a User-Agent.
  "User-Agent": "godfreyponce-portfolio",
};

interface Commit {
  date: string;
  additions: number;
  deletions: number;
}

// Two GitHub calls per refresh; a 10 min TTL caps one warm server instance at
// 12 calls/hour against the 60/hour per-IP limit.
const TTL_MS = 10 * 60 * 1000;
let cached: { value: Commit | null; at: number } | null = null;

async function fetchLatestCommit(): Promise<Commit | null> {
  const eventsRes = await fetch(EVENTS_URL, { headers: GH_HEADERS, cache: "no-store" });
  if (!eventsRes.ok) throw new Error(`events status ${eventsRes.status}`);
  const events: {
    type?: string;
    created_at?: string;
    repo?: { name?: string };
    payload?: { head?: string };
  }[] = await eventsRes.json();
  const push = events.find(
    (e) => e.type === "PushEvent" && e.created_at && e.repo?.name && e.payload?.head,
  );
  if (!push) return null;
  const commitRes = await fetch(
    `https://api.github.com/repos/${push.repo!.name}/commits/${push.payload!.head}`,
    { headers: GH_HEADERS, cache: "no-store" },
  );
  if (!commitRes.ok) throw new Error(`commit status ${commitRes.status}`);
  const commit: { stats?: { additions?: number; deletions?: number } } = await commitRes.json();
  if (typeof commit.stats?.additions !== "number" || typeof commit.stats?.deletions !== "number") {
    return null;
  }
  return {
    date: push.created_at!,
    additions: commit.stats.additions,
    deletions: commit.stats.deletions,
  };
}

export async function GET() {
  const now = Date.now();
  if (!cached || now - cached.at >= TTL_MS) {
    try {
      cached = { value: await fetchLatestCommit(), at: now };
    } catch {
      // Stale-on-error: keep the last good value (or null) and re-arm the TTL
      // so a broken upstream doesn't turn into a GitHub call per pageview.
      cached = { value: cached?.value ?? null, at: now };
    }
  }
  return NextResponse.json({ commit: cached.value }, { headers: { "cache-control": "no-store" } });
}
