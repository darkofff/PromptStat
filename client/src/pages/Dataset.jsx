import { useRef, useState } from "react";
import { parseCsv } from "../utils/handle_csv";
import CsvTable from "../components/CsvTable";

function Dataset() {
  const [csv, setCsv] = useState(null);
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const { headers, rows } = parseCsv(ev.target.result);
      setCsv({ fileName: file.name, headers, rows });
    };
    reader.readAsText(file);
  }

  function handleRemoveCsv() {
    setCsv(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
  /*  flex  flex-col items-center justify-center*/
  return (
    <div
      className=" h-full bg-base text-body border-2
    border-amber-400">
      {csv ? (
        <div className="w-full max-w-4xl px-4 py-4 ">
          <CsvTable
            headers={csv.headers}
            rows={csv.rows}
            fileName={csv.fileName}
            onRemove={handleRemoveCsv}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 ">
          <p className="text-sm text-subtle">No dataset attached yet.</p>
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
