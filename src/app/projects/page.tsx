import type { Metadata } from "next";
import { ProjectGrid } from "@/components/ProjectGrid";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I have built.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  return (
    <div className="container section">
      <h1>Projects</h1>
      <p className="muted">Things I have built.</p>
      <ProjectGrid projects={projects} />
    </div>
  );
}
