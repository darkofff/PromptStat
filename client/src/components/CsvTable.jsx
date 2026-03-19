function CsvTable({ headers, rows, fileName, onRemove }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {fileName} — {rows.length} rows
        </p>
        <button
          onClick={onRemove}
          className="rounded px-2 py-1 text-xs text-red-400 transition hover:bg-red-950 hover:text-red-300">
          Remove
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-700 custom-scrollbar">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-700 bg-gray-800 text-gray-400">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="whitespace-nowrap px-4 py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {rows.map((row, ri) => (
              <tr key={ri} className="bg-gray-900 hover:bg-gray-800">
                {row.map((cell, ci) => (
                  <td key={ci} className="whitespace-nowrap px-4 py-2 text-gray-100">
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
