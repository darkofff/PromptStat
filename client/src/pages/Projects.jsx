import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { slugify } from "../utils/slugify";
import { fetchProjects } from "../api/projects";

const STATUS_STYLES = {
  Active: "bg-success/10 text-success",
  Completed: "bg-info/10 text-info",
  Paused: "bg-warning/10 text-warning",
};

function Projects() {
  const navigate = useNavigate();
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  return (
    <div className="flex-1  h-dvh overflow-y-auto bg-base px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-heading">Projects</h1>

        {error && (
          <p className="mb-4 text-sm text-error">
            Failed to load projects: {error.message}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-5 transition hover:border-accent-hover hover:bg-elevated/50">
            <span className="mb-2 text-3xl text-muted">+</span>
            <span className="text-sm font-medium text-subtle">New Project</span>
          </button>

          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl border border-border bg-surface p-5"
                >
                  <div className="mb-3 h-5 w-3/4 rounded bg-elevated" />
                  <div className="h-4 w-full rounded bg-elevated" />
                </div>
              ))
            : projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => navigate(`/project/${slugify(project.name)}`)}
                  className="cursor-pointer rounded-xl border border-border bg-surface p-5 text-left transition hover:border-accent-hover hover:bg-elevated/50"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="font-semibold text-heading">
                      {project.name}
                    </h2>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        STATUS_STYLES[project.status]
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-subtle">{project.description}</p>
                </button>
              ))}
        </div>
      </div>
    </div>
  );
}

export default Projects;
