import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams, Link } from "react-router-dom";
import apiClient from "../api/client";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Breadcrumbs from "../components/Breadcrumbs";
import { LayoutContext } from "../components/Layout";

type ListResponse = {
  data: Array<Record<string, unknown>>;
  total: number;
  page: number;
  pageSize: number;
};

const ModuleListPage: React.FC = () => {
  const { moduleKey } = useParams<{ moduleKey: string }>();
  const { modules, modulesLoading, modulesError } = useOutletContext<LayoutContext>();
  const moduleConfig = useMemo(() => modules.find((module) => module.key === moduleKey), [modules, moduleKey]);
  const navigate = useNavigate();
  const [records, setRecords] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const pageSize = 20;

  useEffect(() => {
    setPage(1);
    setSearchTerm("");
    setSearchInput("");
  }, [moduleKey]);

  useEffect(() => {
    if (!moduleKey || !moduleConfig) {
      return;
    }

    setLoading(true);
    setError(null);

    apiClient
      .get<ListResponse>(`/modules/${moduleKey}`, {
        params: {
          page,
          pageSize,
          search: searchTerm || undefined
        }
      })
      .then((response) => {
        setRecords(response.data.data);
        setTotal(response.data.total);
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          setError((err.response?.data as { message?: string })?.message || "Failed to load records");
        } else {
          setError(err instanceof Error ? err.message : "Failed to load records");
        }
      })
      .finally(() => setLoading(false));
  }, [moduleKey, moduleConfig, page, pageSize, searchTerm]);

  if (modulesLoading) {
    return <LoadingSpinner label="Loading modules" />;
  }

  if (modulesError) {
    return <ErrorMessage message={modulesError} />;
  }

  if (!moduleConfig) {
    return <ErrorMessage message="Module not available" />;
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1);
    setSearchTerm(searchInput.trim());
  };

  const breadcrumbs = [
    { label: "Modules", to: "/" },
    { label: moduleConfig.label }
  ];

  const columns = moduleConfig.listFields.map((field) => ({ key: field }));

  const handleRowClick = (row: Record<string, unknown>) => {
    const id = row.id as string | undefined;
    if (id) {
      navigate(`/modules/${moduleConfig.key}/${id}`);
    }
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs items={breadcrumbs} />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{moduleConfig.label}</h2>
        <Link to="/" className="text-sm text-blue-600 hover:text-blue-700">
          Back to dashboard
        </Link>
      </div>
      <form onSubmit={handleSearchSubmit} className="flex items-center space-x-3">
        <input
          type="text"
          placeholder="Search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </form>
      <DataTable
        columns={columns}
        rows={records}
        loading={loading}
        error={error}
        onRowClick={handleRowClick}
      />
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModuleListPage;
