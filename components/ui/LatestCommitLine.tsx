"use client";

import { useEffect, useState } from "react";
import { getLatestCommit, type LatestCommit } from "@/lib/github";

// Fills the footer slot reserved by #39. Fetched in the browser so the stat
// survives Amplify's frozen ISR cache (#24). Renders an empty span while
// loading and on any failure so the bottom row's layout never breaks.
export default function LatestCommitLine() {
  const [commit, setCommit] = useState<LatestCommit | null>(null);

  useEffect(() => {
    getLatestCommit().then(setCommit);
  }, []);

  if (!commit) return <span />;

  // Owner pushed today (server-side Chicago day, #43): the summed total.
  if (commit.today) {
    return (
      <span>
        today:{" "}
        <span className="text-diff-add">+{commit.today.additions}</span>{" "}
        <span className="text-diff-del">-{commit.today.deletions}</span>
      </span>
    );
  }

  // Query succeeded but the owner has not pushed today. `date` is not
  // rendered any more; it is the signal that there IS data, which keeps
  // this line off the tokenless path below.
  if (commit.date) {
    return <span>godfrey no commit (yet)...</span>;
  }

  return <span />;
}
