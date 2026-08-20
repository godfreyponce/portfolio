import { NextResponse } from "next/server";
import { chicagoDayStart } from "@/lib/github";

// Footer status line (#40), one GraphQL query since #43: the REST events
// feed lags by hours and redacts private-push payloads, so the day total
// is summed from repo refs instead. Same caching stance as before:
// CloudFront froze ISR (#24), so cache in module memory only, with
// force-dynamic + no-store keeping Next and CloudFront out of the way.
export const dynamic = "force-dynamic";

// GraphQL refuses anonymous queries, so tokenless there is NO data path
// (#43 decision, option B): the route returns the empty payload and the
// footer line renders nothing. A fresh clone without .env.local is not
// broken, it is this fallback.
const token = process.env.GITHUB_TOKEN;

// first: 15 repos by PUSHED_AT covered every repo touched in the month
// before 2026-08-19; the ordering puts every repo pushed today ahead of
// all others, so 15 is a measured bound, not a guess. first: 100 on
// today's history is the API's own page max. The author filter keeps
// collaborators in shared repos out of the sum.
const QUERY = `
query ($since: GitTimestamp!) {
  viewer {
    repositories(first: 15, orderBy: { field: PUSHED_AT, direction: DESC }) {
      nodes {
        defaultBranchRef {
          target {
            ... on Commit {
              today: history(first: 100, since: $since, author: { id: "U_kgDOBhysEw" }) {
                nodes { additions deletions }
              }
              latest: history(first: 1, author: { id: "U_kgDOBhysEw" }) {
                nodes { committedDate }
              }
            }
          }
        }
      }
    }
  }
}`;

interface Payload {
  // Owner's additions/deletions summed across every repo pushed to today
  // (midnight America/Chicago). Null on a day with no commits yet.
  today: { additions: number; deletions: number } | null;
  // Newest owner commit date across repos. Not rendered since #43's copy
  // change: it is the "this query returned real data" signal, so a day
  // with no pushes reads differently from a tokenless or failed fetch.
  date: string | null;
}

const EMPTY: Payload = { today: null, date: null };

// One GitHub call per refresh; a 10 min TTL is 6 calls/hour against a
// 5000 points/hour GraphQL budget at a measured 1 point per query.
const TTL_MS = 10 * 60 * 1000;
let cached: { value: Payload; at: number } | null = null;

interface RepoNode {
  defaultBranchRef?: {
    target?: {
      today?: { nodes?: { additions?: number; deletions?: number }[] };
      latest?: { nodes?: { committedDate?: string }[] };
    };
  } | null;
}

async function fetchDayStats(): Promise<Payload> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      // GitHub rejects requests without a User-Agent.
      "User-Agent": "godfreyponce-portfolio",
    },
    body: JSON.stringify({ query: QUERY, variables: { since: chicagoDayStart(new Date()) } }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`graphql status ${res.status}`);
  const json: {
    errors?: unknown[];
    data?: { viewer?: { repositories?: { nodes?: RepoNode[] } } };
  } = await res.json();
  if (json.errors?.length) throw new Error("graphql errors");
  let additions = 0;
  let deletions = 0;
  let commits = 0;
  let date: string | null = null;
  for (const repo of json.data?.viewer?.repositories?.nodes ?? []) {
    const target = repo?.defaultBranchRef?.target;
    for (const c of target?.today?.nodes ?? []) {
      if (typeof c.additions === "number" && typeof c.deletions === "number") {
        additions += c.additions;
        deletions += c.deletions;
        commits++;
      }
    }
    const d = target?.latest?.nodes?.[0]?.committedDate;
    if (typeof d === "string" && (!date || d > date)) date = d;
  }
  return { today: commits > 0 ? { additions, deletions } : null, date };
}

export async function GET() {
  if (!token) {
    return NextResponse.json(EMPTY, { headers: { "cache-control": "no-store" } });
  }
  const now = Date.now();
  if (!cached || now - cached.at >= TTL_MS) {
    try {
      cached = { value: await fetchDayStats(), at: now };
    } catch {
      // Stale-on-error: keep the last good value (or empty) and re-arm the
      // TTL so a broken upstream doesn't turn into a GitHub call per pageview.
      cached = { value: cached?.value ?? EMPTY, at: now };
    }
  }
  return NextResponse.json(cached.value, { headers: { "cache-control": "no-store" } });
}
