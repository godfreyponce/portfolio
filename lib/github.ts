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
  date: string;
  // Absent together when the newest push is private (#41): recency only.
  additions?: number;
  deletions?: number;
}

// Footer status line (#40). Browser-only via the same-origin route, same
// reasons as getStreaks (#24/#25). Null on any failure so the line hides.
// Stats are optional since #41: a private newest push arrives date-only.
export async function getLatestCommit(): Promise<LatestCommit | null> {
  try {
    const res = await fetch("/api/latest-commit");
    if (!res.ok) return null;
    const json: { commit?: { date?: string; additions?: number; deletions?: number } | null } =
      await res.json();
    const c = json.commit;
    if (!c || typeof c.date !== "string") return null;
    if (typeof c.additions === "number" && typeof c.deletions === "number") {
      return { date: c.date, additions: c.additions, deletions: c.deletions };
    }
    return { date: c.date };
  } catch {
    return null;
  }
}

// Pure so it can be verified with a one-off node run (same precedent as
// computeStreaks). Calendar-day difference in the viewer's local timezone;
// clock skew that puts the push in the future still reads "today".
export function commitPhrase(dateISO: string, now: Date): string {
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOfDay(now) - startOfDay(new Date(dateISO))) / DAY_MS);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}
