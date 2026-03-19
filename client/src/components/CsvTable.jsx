function CsvTable({ headers, rows, fileName, onRemove }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-subtle">
          {fileName} — {rows.length} rows
        </p>
        <button
          onClick={onRemove}
          className="rounded px-2 py-1 text-xs text-error transition hover:bg-error/10 hover:text-error">
          Remove
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border custom-scrollbar">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-elevated text-subtle">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="whitespace-nowrap px-4 py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row, ri) => (
              <tr key={ri} className="bg-surface hover:bg-elevated">
                {row.map((cell, ci) => (
                  <td key={ci} className="whitespace-nowrap px-4 py-2 text-body">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CsvTable;
