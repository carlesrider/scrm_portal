import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
import ModuleSelector from "./ModuleSelector";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

export type ModuleInfo = {
  key: string;
  label: string;
  listFields: string[];
  detailFields: string[];
  editableFields: string[];
};

export type LayoutContext = {
  modules: ModuleInfo[];
  modulesLoading: boolean;
  modulesError: string | null;
};

const Layout: React.FC = () => {
  const { contact, logout } = useAuth();
  const navigate = useNavigate();
  const [modules, setModules] = useState<ModuleInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setLoading(true);
    apiClient
      .get<{ modules: ModuleInfo[] }>("/modules")
      .then((response) => {
        if (!active) return;
        setModules(response.data.modules);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load modules");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const outletContext = useMemo<LayoutContext>(
    () => ({ modules, modulesLoading: loading, modulesError: error }),
    [modules, loading, error]
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">SuiteCRM Client Portal</h1>
            <p className="text-sm text-gray-500">Access and update your data securely</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{contact?.contact_name}</p>
              <p className="text-xs text-gray-500">{contact?.contact_email || contact?.username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <aside className="lg:col-span-1">
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm p-4 flex justify-center">
              <LoadingSpinner size="sm" />
            </div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <ModuleSelector modules={modules} />
          )}
        </aside>
        <section className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow-sm p-6 min-h-[400px]">
            <Outlet context={outletContext} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Layout;
