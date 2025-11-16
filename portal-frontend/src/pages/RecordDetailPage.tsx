import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import apiClient from "../api/client";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import FieldRenderer from "../components/FieldRenderer";
import Breadcrumbs from "../components/Breadcrumbs";
import { LayoutContext } from "../components/Layout";

const RecordDetailPage: React.FC = () => {
  const { moduleKey, id } = useParams<{ moduleKey: string; id: string }>();
  const navigate = useNavigate();
  const { modules, modulesLoading, modulesError } = useOutletContext<LayoutContext>();
  const moduleConfig = useMemo(() => modules.find((module) => module.key === moduleKey), [modules, moduleKey]);
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!moduleKey || !id || !moduleConfig) {
      return;
    }
    setLoading(true);
    setError(null);

    apiClient
      .get<{ record: Record<string, unknown> }>(`/modules/${moduleKey}/${id}`)
      .then((response) => {
        setRecord(response.data.record);
        const editableValues: Record<string, string> = {};
        moduleConfig.editableFields.forEach((field) => {
          const value = response.data.record[field];
          editableValues[field] = value != null ? String(value) : "";
        });
        setFormValues(editableValues);
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          setError((err.response?.data as { message?: string })?.message || "Failed to load record");
        } else {
          setError(err instanceof Error ? err.message : "Failed to load record");
        }
      })
      .finally(() => setLoading(false));
  }, [moduleKey, id, moduleConfig]);

  if (modulesLoading || loading) {
    return <LoadingSpinner label="Loading record" />;
  }

  if (modulesError) {
    return <ErrorMessage message={modulesError} />;
  }

  if (!moduleConfig) {
    return <ErrorMessage message="Module not available" />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!record) {
    return <ErrorMessage message="Record not found" />;
  }

  const breadcrumbs = [
    { label: "Modules", to: "/" },
    { label: moduleConfig.label, to: `/modules/${moduleConfig.key}` },
    { label: (record.name as string) || (record.case_number as string) || (record.id as string) }
  ];

  const handleFieldChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!moduleKey || !id) return;
    setSaving(true);
    setSuccessMessage(null);
    setError(null);

    const changedFields: Record<string, string> = {};
    moduleConfig.editableFields.forEach((field) => {
      const originalValue = record[field];
      const newValue = formValues[field];
      if ((originalValue ?? "") !== (newValue ?? "")) {
        changedFields[field] = newValue;
      }
    });

    if (!Object.keys(changedFields).length) {
      setSuccessMessage("No changes to save");
      setSaving(false);
      return;
    }

    try {
      const response = await apiClient.put<{ record: Record<string, unknown> }>(
        `/modules/${moduleKey}/${id}`,
        changedFields
      );
      setRecord(response.data.record);
      moduleConfig.editableFields.forEach((field) => {
        const value = response.data.record[field];
        setFormValues((prev) => ({ ...prev, [field]: value != null ? String(value) : "" }));
      });
      setSuccessMessage("Record updated successfully");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError((err.response?.data as { message?: string })?.message || "Failed to update record");
      } else {
        setError(err instanceof Error ? err.message : "Failed to update record");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs items={breadcrumbs} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{record.name || moduleConfig.label}</h2>
          <p className="text-sm text-gray-500">Record ID: {record.id as string}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Back
        </button>
      </div>
      {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {moduleConfig.detailFields.map((field) => (
          <FieldRenderer
            key={field}
            field={field}
            value={formValues[field] ?? record[field]}
            editable={moduleConfig.editableFields.includes(field)}
            onChange={(value) => handleFieldChange(field, value)}
          />
        ))}
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
};

export default RecordDetailPage;
