import { NextRequest, NextResponse } from "next/server";

// Same-origin proxy for the jogruber contributions API (#25): visitors with
// content blockers can't reach the third-party domain from the browser, and
// the free API can flake. Server-side fetch + retry fixes both. no-store keeps
// CloudFront (the layer that froze ISR, see #24) from caching the response.
export const dynamic = "force-dynamic";

const UPSTREAM = "https://github-contributions-api.jogruber.de/v4/godfreyponce";

async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) return res;
      lastError = new Error(`upstream status ${res.status}`);
    } catch (e) {
      lastError = e;
    }
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, 300 * (i + 1)));
  }
  throw lastError;
}

export async function GET(req: NextRequest) {
  const y = req.nextUrl.searchParams.get("y");
  if (y !== "all" && y !== "last") {
    return NextResponse.json({ error: "y must be 'all' or 'last'" }, { status: 400 });
  }
  try {
    const res = await fetchWithRetry(`${UPSTREAM}?y=${y}`);
    const json = await res.json();
    return NextResponse.json(json, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "upstream unavailable" }, { status: 502 });
  }
}
