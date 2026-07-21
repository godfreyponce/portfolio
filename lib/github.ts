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
// Returns null on any failure so the streak line simply doesn't render.
export async function getStreaks(): Promise<Streaks | null> {
  try {
    const res = await fetch("https://github-contributions-api.jogruber.de/v4/godfreyponce?y=all", {
      next: { revalidate: 21600 },
    });
    if (!res.ok) return null;
    const json: { contributions?: { date: string; count: number }[] } = await res.json();
    if (!json.contributions?.length) return null;
    return computeStreaks(json.contributions, new Date().toISOString().slice(0, 10));
  } catch {
    return null;
  }
}

// Public contributions API (no token needed), revalidated every 6 hours.
// Returns null on any failure so the GitHub tile can render without the heatmap.
export async function getContributions(): Promise<Contributions | null> {
  try {
    const res = await fetch("https://github-contributions-api.jogruber.de/v4/godfreyponce?y=last", {
      next: { revalidate: 21600 },
    });
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
