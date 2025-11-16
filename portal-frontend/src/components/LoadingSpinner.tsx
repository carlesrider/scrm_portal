import React from "react";

type Props = {
  size?: "sm" | "md" | "lg";
  label?: string;
};

const sizeClasses: Record<Required<Props>["size"], string> = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12"
};

const LoadingSpinner: React.FC<Props> = ({ size = "md", label }) => (
  <div className="flex flex-col items-center space-y-2 text-gray-600">
    <svg
      className={`animate-spin ${sizeClasses[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
    {label && <span className="text-sm">{label}</span>}
  </div>
);

export default LoadingSpinner;
