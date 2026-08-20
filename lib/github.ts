export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface Contributions {
  days: ContributionDay[];
  total: number;
}

export interface Streaks {
  current: number;
  longest: number;
}

const DAY_MS = 86400000;

// Pure so it can be verified with a one-off node run. Handles the API's quirks:
// years arrive in descending order, and the current year is padded with
// future zero-count days. A zero-count today does not break the current streak.
export function computeStreaks(days: { date: string; count: number }[], todayISO: string): Streaks {
  const past = days.filter((d) => d.date <= todayISO).sort((a, b) => (a.date < b.date ? -1 : 1));

  let longest = 0;
  let run = 0;
  for (let i = 0; i < past.length; i++) {
    const adjacent = i > 0 && Date.parse(past[i].date) - Date.parse(past[i - 1].date) === DAY_MS;
    run = past[i].count > 0 ? (adjacent ? run : 0) + 1 : 0;
    if (run > longest) longest = run;
  }

  let current = 0;
  let i = past.length - 1;
  if (i >= 0 && past[i].date === todayISO && past[i].count === 0) i--;
  for (; i >= 0 && past[i].count > 0; i--) {
    if (current > 0 && Date.parse(past[i + 1].date) - Date.parse(past[i].date) !== DAY_MS) break;
    current++;
  }

  return { current, longest };
}

// All-years contributions so the longest streak is all-time, not capped at 365 days.
// Called from the browser (#24, so Amplify's frozen ISR can't stale it) via the
// same-origin proxy (#25, so content blockers can't block it; the relative URL
// means this is browser-only). Returns null on any failure so the streak line
// simply doesn't render.
export async function getStreaks(): Promise<Streaks | null> {
  try {
    const res = await fetch("/api/contributions?y=all");
    if (!res.ok) return null;
    const json: { contributions?: { date: string; count: number }[] } = await res.json();
    if (!json.contributions?.length) return null;
    return computeStreaks(json.contributions, new Date().toISOString().slice(0, 10));
  } catch {
    return null;
  }
}

// Last-year contributions for the heatmap, called from the browser via the
// same-origin proxy (#24 + #25, same reasons as getStreaks; browser-only).
// Returns null on any failure so the GitHub tile can render without the heatmap.
export async function getContributions(): Promise<Contributions | null> {
  try {
    const res = await fetch("/api/contributions?y=last");
    if (!res.ok) return null;
    const json: {
      total?: { lastYear?: number };
      contributions?: { date: string; count: number; level: number }[];
    } = await res.json();
    if (!json.contributions?.length) return null;
    const days = json.contributions.map((c) => ({
      date: c.date,
      count: c.count,
      level: Math.min(Math.max(c.level, 0), 4) as ContributionDay["level"],
    }));
    const total =
      typeof json.total?.lastYear === "number" ? json.total.lastYear : days.reduce((sum, d) => sum + d.count, 0);
    return { days, total };
  } catch {
    return null;
  }
}

export interface LatestCommit {
  // Present when the owner pushed today (midnight America/Chicago, #43):
  // additions/deletions summed across every repo, owner's commits only.
  today?: { additions: number; deletions: number };
  // Newest owner commit date across repos. Not rendered: it is how the
  // line tells "query worked, nothing pushed today" apart from "no data
  // at all" (tokenless or upstream failure), which render differently.
  date?: string;
}

// Footer status line (#40, reshaped by #43). Browser-only via the
// same-origin route, same reasons as getStreaks (#24/#25). Null when the
// payload carries neither field (tokenless or upstream failure) so the
// line hides.
export async function getLatestCommit(): Promise<LatestCommit | null> {
  try {
    const res = await fetch("/api/latest-commit");
    if (!res.ok) return null;
    const json: {
      today?: { additions?: number; deletions?: number } | null;
      date?: string | null;
    } = await res.json();
    const out: LatestCommit = {};
    if (typeof json.today?.additions === "number" && typeof json.today?.deletions === "number") {
      out.today = { additions: json.today.additions, deletions: json.today.deletions };
    }
    if (typeof json.date === "string") out.date = json.date;
    return out.today || out.date ? out : null;
  } catch {
    return null;
  }
}

// Pure so it can be verified with a one-off node run (same precedent as
// computeStreaks). The UTC instant of the most recent midnight in
// America/Chicago, as ISO-8601 with offset, for GraphQL's GitTimestamp.
// Uses now's offset, so on the two DST transition days a year the boundary
// can be an hour off near midnight; accepted (#43).
export function chicagoDayStart(now: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZoneName: "longOffset",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const offset = get("timeZoneName").replace("GMT", "");
  return `${get("year")}-${get("month")}-${get("day")}T00:00:00${offset}`;
}
