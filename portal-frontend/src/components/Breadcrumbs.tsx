import React from "react";
import { Link } from "react-router-dom";

type Crumb = {
  label: string;
  to?: string;
};

type Props = {
  items: Crumb[];
};

const Breadcrumbs: React.FC<Props> = ({ items }) => (
  <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
    <ol className="flex items-center space-x-2">
      {items.map((item, index) => (
        <li key={`${item.label}-${index}`} className="flex items-center space-x-2">
          {item.to ? (
            <Link to={item.to} className="hover:text-blue-600">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-medium">{item.label}</span>
          )}
          {index < items.length - 1 && <span>/</span>}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumbs;
