import { useState } from "react";

const MOCK_PROJECTS = [
  { id: 1, name: "Customer Churn Analysis", description: "Predict customer churn using transaction history", status: "Active" },
  { id: 2, name: "Sales Forecasting", description: "Quarterly revenue predictions based on pipeline data", status: "Active" },
  { id: 3, name: "Sentiment Analysis", description: "NLP model for product review classification", status: "Completed" },
  { id: 4, name: "Fraud Detection", description: "Real-time anomaly detection on payment transactions", status: "Active" },
  { id: 5, name: "Inventory Optimization", description: "Demand forecasting for warehouse stock levels", status: "Paused" },
  { id: 6, name: "User Segmentation", description: "Cluster users by behavior for targeted campaigns", status: "Completed" },
];

const STATUS_STYLES = {
  Active: "bg-green-900/50 text-green-400",
  Completed: "bg-blue-900/50 text-blue-400",
  Paused: "bg-yellow-900/50 text-yellow-400",
};

function Projects() {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-white">Projects</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-700 p-5 transition hover:border-indigo-500 hover:bg-gray-800/50">
            <span className="mb-2 text-3xl text-gray-500">+</span>
            <span className="text-sm font-medium text-gray-400">New Project</span>
          </button>
          {MOCK_PROJECTS.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelectedId(project.id)}
              className={`cursor-pointer rounded-xl border p-5 text-left transition hover:border-indigo-500 hover:bg-gray-800/50 ${
                selectedId === project.id
                  ? "border-indigo-500 bg-gray-800/60 ring-1 ring-indigo-500/40"
                  : "border-gray-700 bg-gray-900"
              }`}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-white">{project.name}</h2>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[project.status]}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-sm text-gray-400">{project.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Projects;
