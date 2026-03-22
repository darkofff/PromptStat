import { useNavigate } from "react-router-dom";
import { slugify } from "../utils/slugify";

const MOCK_PROJECTS = [
  {
    id: 1,
    name: "Customer Churn Analysis",
    description: "Predict customer churn using transaction history",
    status: "Active",
  },
  {
    id: 2,
    name: "Sales Forecasting",
    description: "Quarterly revenue predictions based on pipeline data",
    status: "Active",
  },
  {
    id: 3,
    name: "Sentiment Analysis",
    description: "NLP model for product review classification",
    status: "Completed",
  },
  {
    id: 4,
    name: "Fraud Detection",
    description: "Real-time anomaly detection on payment transactions",
    status: "Active",
  },
  {
    id: 5,
    name: "Inventory Optimization",
    description: "Demand forecasting for warehouse stock levels",
    status: "Paused",
  },
  {
    id: 6,
    name: "User Segmentation",
    description: "Cluster users by behavior for targeted campaigns",
    status: "Completed",
  },
];

const STATUS_STYLES = {
  Active: "bg-success/10 text-success",
  Completed: "bg-info/10 text-info",
  Paused: "bg-warning/10 text-warning",
};

function Projects() {
  const navigate = useNavigate();

  return (
    <div className="flex-1  h-dvh overflow-y-auto bg-base px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-heading">Projects</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-5 transition hover:border-accent-hover hover:bg-elevated/50">
            <span className="mb-2 text-3xl text-muted">+</span>
            <span className="text-sm font-medium text-subtle">New Project</span>
          </button>
          {MOCK_PROJECTS.map((project) => (
            <button
              key={project.id}
              onClick={() => navigate(`/project/${slugify(project.name)}`)}
              className="cursor-pointer rounded-xl border border-border bg-surface p-5 text-left transition hover:border-accent-hover hover:bg-elevated/50">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-heading">{project.name}</h2>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    STATUS_STYLES[project.status]
                  }`}>
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
