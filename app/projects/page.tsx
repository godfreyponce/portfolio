import type { Metadata } from "next";
import ProjectsIndex from "@/components/sections/ProjectsIndex";

export const metadata: Metadata = {
  title: "Projects | Godfrey Ponce",
  description:
    "Everything Godfrey Ponce has built, from hackathon weekends to long-running personal projects.",
};

export default function ProjectsPage() {
  return (
    <main className="relative w-full">
      <ProjectsIndex />
    </main>
  );
}
