"use client";

import { useEffect, useState } from "react";
import { commitPhrase, getLatestCommit, type LatestCommit } from "@/lib/github";

// Fills the footer slot reserved by #39. Fetched in the browser so the stat
// survives Amplify's frozen ISR cache (#24). Renders an empty span while
// loading and on any failure so the bottom row's layout never breaks.
export default function LatestCommitLine() {
  const [commit, setCommit] = useState<LatestCommit | null>(null);

  useEffect(() => {
    getLatestCommit().then(setCommit);
  }, []);

  if (!commit) return <span />;

  return (
    <span>
      latest commit {commitPhrase(commit.date, new Date())}:{" "}
      <span className="text-diff-add">+{commit.additions}</span>{" "}
      <span className="text-diff-del">-{commit.deletions}</span>
    </span>
  );
}
