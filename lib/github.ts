export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface Contributions {
  days: ContributionDay[];
  total: number;
}

// Public contributions API (no token needed), revalidated daily.
// Returns null on any failure so the GitHub tile can render without the heatmap.
export async function getContributions(): Promise<Contributions | null> {
  try {
    const res = await fetch("https://github-contributions-api.jogruber.de/v4/godfreyponce?y=last", {
      next: { revalidate: 86400 },
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
