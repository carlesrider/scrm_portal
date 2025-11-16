import React from "react";
import { NavLink } from "react-router-dom";
import { ModuleInfo } from "./Layout";

type Props = {
  modules: ModuleInfo[];
};

const ModuleSelector: React.FC<Props> = ({ modules }) => {
  if (!modules.length) {
    return <p className="text-sm text-gray-500">No modules available.</p>;
  }

  return (
    <nav className="bg-white rounded-lg shadow-sm divide-y">
      {modules.map((module) => (
        <NavLink
          key={module.key}
          to={`/modules/${module.key}`}
          className={({ isActive }) =>
            `block px-4 py-3 text-sm font-medium transition-colors ${
              isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
            }`
          }
        >
          {module.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default ModuleSelector;
