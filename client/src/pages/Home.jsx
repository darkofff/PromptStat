import { useRef, useState } from "react";
import ChatHistory from "../components/ChatHistory";
import CsvTable from "../components/CsvTable";
import PromptInput from "../components/PromptInput";
import { useAskPrompt } from "../hooks/useAskPrompt";

function parseCsv(text) {
  const lines = text.trim().split("\n");
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines
    .slice(1)
    .map((line) => line.split(",").map((c) => c.trim()));
  return { headers, rows };
}

function Home() {
  const { text, setText, history, loading, handleSubmit } = useAskPrompt();
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

  return (
    <div className="flex overflow-y-hidden h-full flex-col bg-gray-950 text-gray-100 ">
      {csv && (
        <div className="mx-auto w-full max-w-4xl px-4 py-4">
          <CsvTable
            headers={csv.headers}
            rows={csv.rows}
            fileName={csv.fileName}
            onRemove={handleRemoveCsv}
          />
        </div>
      )}
      <ChatHistory history={history} />

      <div>
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 pb-1">
          {!csv && (
            <>
              <label
                htmlFor="csv-upload"
                className="cursor-pointer rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs text-gray-400 transition hover:border-gray-500 hover:text-gray-200">
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
            </>
          )}
        </div>
        <PromptInput
          text={text}
          setText={setText}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default Home;
