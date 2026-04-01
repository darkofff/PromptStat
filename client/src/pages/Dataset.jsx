import { useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDatasets, uploadDataset, deleteDataset } from "../api/datasets";
import CsvTable from "../components/CsvTable";

function Dataset() {
  const fileInputRef = useRef(null);
  const { projectId } = useParams();
  const queryClient = useQueryClient();

  const { data: datasets = [], isLoading } = useQuery({
    queryKey: ["datasets", projectId],
    queryFn: () => fetchDatasets(projectId),
    enabled: !!projectId,
  });
  const dataset = datasets[0] ?? null;

  const { mutate: upload, isPending } = useMutation({
    mutationFn: (file) => uploadDataset(projectId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["datasets", projectId] });
    },
  });

  const { mutate: remove } = useMutation({
    mutationFn: (datasetId) => deleteDataset(datasetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["datasets", projectId] });
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
  });

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    upload(file);
  }

  function handleRemoveCsv() {
    if (dataset) {
      remove(dataset.id);
    }
  }

  // Dataset z bazy — parsujemy JSON z pola data na headers + rows
  const csv = dataset?.data ? (() => {
    const rows = JSON.parse(dataset.data);
    const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
    return { fileName: dataset.name, headers, rows: rows.map(Object.values) };
  })() : null;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-base text-subtle">
        Loading...
      </div>
    );
  }

  return (
    <div className="custom-scrollbar h-full overflow-y-auto bg-base text-body ">
      {csv ? (
        <div className="h-full px-4 py-4 ">
          <CsvTable
            headers={csv.headers}
            rows={csv.rows}
            fileName={csv.fileName}
            onRemove={handleRemoveCsv}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 translate-y-1/2 ">
          <p className="text-sm text-subtle">
            {isPending ? "Uploading..." : "No dataset attached yet."}
          </p>
          <label
            htmlFor="csv-upload"
            className="cursor-pointer rounded-lg border border-border bg-surface px-4 py-2 text-sm text-subtle transition hover:border-muted hover:text-body">
            Attach CSV
          </label>
          <input
            ref={fileInputRef}
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}

export default Dataset;
