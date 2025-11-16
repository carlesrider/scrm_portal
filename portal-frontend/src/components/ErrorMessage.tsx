import React from "react";

type Props = {
  message: string;
};

const ErrorMessage: React.FC<Props> = ({ message }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
    {message}
  </div>
);

export default ErrorMessage;
