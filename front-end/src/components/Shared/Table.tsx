import React from "react";
import Spinner from "./Spinner";

type TableProps<T extends { _id: string }> = {
  headers: string[];
  data: T[];
  colSpan: number;
  emptyMessage?: string;
  renderRow: (item: T) => React.ReactNode;
  isFetching?: boolean;
};

export default function Table<T extends { _id: string }>({
  headers,
  data,
  colSpan,
  emptyMessage = "No data found",
  isFetching = false,
  renderRow,
}: TableProps<T>) {
  return (
    <div className="relative bg-white rounded-xl border border-[var(--border-1)] overflow-x-auto">
      {isFetching && data.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
          <Spinner className="h-5! w-5!" />
        </div>
      )}

      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            {headers.map((header) => (
              <th key={header} className="text-left px-4 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={colSpan} className="text-center py-6 text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => renderRow(item))
          )}
        </tbody>
      </table>
    </div>
  );
}
