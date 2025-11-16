import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

type Column = {
  key: string;
  label?: string;
};

type Props = {
  columns: Column[];
  rows: Array<Record<string, unknown>>;
  onRowClick?: (row: Record<string, unknown>) => void;
  loading?: boolean;
  error?: string | null;
};

const formatLabel = (label: string) =>
  label
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const DataTable: React.FC<Props> = ({ columns, rows, onRowClick, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner label="Loading records" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!rows.length) {
    return <p className="text-sm text-gray-500">No records found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                {column.label || formatLabel(column.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row) => (
            <tr
              key={row.id as string}
              className={`hover:bg-blue-50 ${onRowClick ? "cursor-pointer" : ""}`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-sm text-gray-700">
                  {row[column.key] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
