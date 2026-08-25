"use client";

import { useEffect, useState } from "react";
import { getLatestCommit, type LatestCommit } from "@/lib/github";

// Fills the footer slot reserved by #39. Fetched in the browser so the stat
// survives Amplify's frozen ISR cache (#24). Renders an empty span while
// loading and on any failure so the bottom row's layout never breaks.
//
// The pixel cmux chevron (#44). Hand-drawn on a 4x5 grid at 2 css px per
// cell, so crispEdges never splits a cell across device pixels. Shown on both
// data branches so it does not vanish on a day with no push.
const chevron = (
  <svg
    viewBox="0 0 4 5"
    width="8"
    height="10"
    shapeRendering="crispEdges"
    aria-hidden="true"
    className="mr-1 inline-block"
  >
    <g fill="#3b82f6">
      <rect x="0" y="0" width="2" height="1" />
      <rect x="1" y="1" width="2" height="1" />
    </g>
    <rect fill="#6366f1" x="2" y="2" width="2" height="1" />
    <g fill="#8b5cf6">
      <rect x="1" y="3" width="2" height="1" />
      <rect x="0" y="4" width="2" height="1" />
    </g>
  </svg>
);

export default function LatestCommitLine() {
  const [commit, setCommit] = useState<LatestCommit | null>(null);

  useEffect(() => {
    getLatestCommit().then(setCommit);
  }, []);

  if (!commit) return <span />;

  // Owner pushed today (server-side Chicago day, #43): the summed total,
  // fronted by the pixel cmux chevron (#44).
  if (commit.today) {
    return (
      <span>
        {chevron}
        lines changed today:{" "}
        <span className="text-diff-add">+{commit.today.additions}</span>{" "}
        <span className="text-diff-del">-{commit.today.deletions}</span>
      </span>
    );
  }

  // Query succeeded but the owner has not pushed today. `date` is not
  // rendered any more; it is the signal that there IS data, which keeps
  // this line off the tokenless path below.
  if (commit.date) {
    return (
      <span>
        {chevron}
        godfrey no line change (yet)...
      </span>
    );
  }

  return <span />;
}
