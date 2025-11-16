import React from "react";

const formatLabel = (label: string) =>
  label
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

type Props = {
  field: string;
  value: unknown;
  editable?: boolean;
  onChange?: (value: string) => void;
};

const FieldRenderer: React.FC<Props> = ({ field, value, editable, onChange }) => {
  const displayValue = value ?? "";
  const label = formatLabel(field);

  if (!editable) {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase mb-1">{label}</label>
        <p className="text-sm text-gray-800 whitespace-pre-line">
          {displayValue ? String(displayValue) : "—"}
        </p>
      </div>
    );
  }

  const isLongText = typeof displayValue === "string" && displayValue.length > 120;

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 uppercase mb-1" htmlFor={field}>
        {label}
      </label>
      {isLongText ? (
        <textarea
          id={field}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={displayValue as string}
          onChange={(event) => onChange?.(event.target.value)}
          rows={4}
        />
      ) : (
        <input
          id={field}
          type="text"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={displayValue as string}
          onChange={(event) => onChange?.(event.target.value)}
        />
      )}
    </div>
  );
};

export default FieldRenderer;
