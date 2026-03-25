import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { slugify } from "../utils/slugify";
import { fetchProjects, createProject } from "../api/projects";

function Projects() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setModalOpen(false);
      setTitle("");
      setDescription("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ title, description });
  };

  return (
    <div className="flex-1 h-dvh overflow-y-auto bg-base px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-heading">Projects</h1>

        {error && (
          <p className="mb-4 text-sm text-error">
            Failed to load projects: {error.message}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={() => setModalOpen(true)}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-5 transition hover:border-accent-hover hover:bg-elevated/50"
          >
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
                  onClick={() => navigate(`/project/${slugify(project.title)}`)}
                  className="cursor-pointer rounded-xl border border-border bg-surface p-5 text-left transition hover:border-accent-hover hover:bg-elevated/50"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="font-semibold text-heading">
                      {project.title}
                    </h2>
                  </div>
                  <p className="text-sm text-subtle">{project.description}</p>
                </button>
              ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setModalOpen(false)}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl border border-border bg-surface p-6"
          >
            <h2 className="mb-4 text-lg font-semibold text-heading">
              New Project
            </h2>

            <label className="mb-1 block text-sm text-subtle">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mb-4 w-full rounded-lg border border-border bg-base px-3 py-2 text-body outline-none focus:border-accent-hover focus:ring-1 focus:ring-accent-hover/40"
            />

            <label className="mb-1 block text-sm text-subtle">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="mb-4 w-full rounded-lg border border-border bg-base px-3 py-2 text-body outline-none focus:border-accent-hover focus:ring-1 focus:ring-accent-hover/40 resize-none"
            />

            {mutation.isError && (
              <p className="mb-3 text-sm text-error">
                Failed to create project: {mutation.error.message}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg px-4 py-2 text-sm text-subtle hover:text-body cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-heading hover:bg-accent-hover disabled:opacity-50 cursor-pointer"
              >
                {mutation.isPending ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Projects;
