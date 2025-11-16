import createHttpError from "http-errors";
import { portalConfig, PortalModuleConfig } from "../config/portalConfig.js";
import { suitecrmRequest } from "./suitecrmClient.js";
import { PaginatedResult } from "../types/portal.js";
import { SuiteCRMListResponse, SuiteCRMRecordResponse } from "../types/suitecrm.js";

type SuiteCRMAttributes = Record<string, unknown>;

type ModuleRecord = {
  id: string;
  attributes: SuiteCRMAttributes;
};

const ensureModuleAccess = (module: string): PortalModuleConfig => {
  const config = portalConfig.modules[module];
  if (!config) {
    throw createHttpError(403, "Module is not available in the portal");
  }
  return config;
};

const buildFilterPayload = (
  moduleConfig: PortalModuleConfig,
  options: {
    page: number;
    pageSize: number;
    search?: string;
  }
) => {
  const filters: Record<string, unknown>[] = [];

  if (moduleConfig.defaultFilter) {
    filters.push(moduleConfig.defaultFilter);
  }

  if (options.search && moduleConfig.searchFields?.length) {
    const orFilters = moduleConfig.searchFields.map((field) => ({
      [field]: {
        $contains: options.search
      }
    }));

    filters.push({
      $or: orFilters
    });
  }

  return {
    filter: filters,
    max_num: options.pageSize,
    offset: (options.page - 1) * options.pageSize,
    fields: moduleConfig.listFields,
    sort: "-date_modified"
  };
};

const mapRecord = (record: ModuleRecord, fields: string[]) => {
  const attributes = record.attributes;
  const mapped: Record<string, unknown> = { id: record.id };
  fields.forEach((field) => {
    mapped[field] = attributes[field];
  });
  return mapped;
};

export const listModules = () =>
  Object.entries(portalConfig.modules).map(([moduleKey, module]) => ({
    key: moduleKey,
    label: module.label,
    listFields: module.listFields,
    detailFields: module.detailFields,
    editableFields: module.editableFields
  }));

export const listModuleRecords = async (
  module: string,
  page: number,
  pageSize: number,
  search?: string
): Promise<PaginatedResult<Record<string, unknown>>> => {
  const moduleConfig = ensureModuleAccess(module);
  const payload = buildFilterPayload(moduleConfig, { page, pageSize, search });

  const response = await suitecrmRequest<SuiteCRMListResponse<SuiteCRMAttributes>>({
    method: "POST",
    url: `/Api/V8/module/${module}/filter`,
    data: payload
  });

  const data = response.data.map((record) => mapRecord(record, moduleConfig.listFields));
  const total = response.meta?.total ?? data.length;

  return {
    data,
    total,
    page,
    pageSize
  };
};

export const getModuleRecord = async (
  module: string,
  id: string
): Promise<Record<string, unknown>> => {
  const moduleConfig = ensureModuleAccess(module);

  const response = await suitecrmRequest<SuiteCRMRecordResponse<SuiteCRMAttributes>>({
    method: "GET",
    url: `/Api/V8/module/${module}/${id}`
  });

  return mapRecord(
    { id: response.data.id, attributes: response.data.attributes },
    moduleConfig.detailFields
  );
};

export const updateModuleRecord = async (
  module: string,
  id: string,
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> => {
  const moduleConfig = ensureModuleAccess(module);

  const sanitizedPayload = Object.fromEntries(
    Object.entries(payload).filter(([field]) => moduleConfig.editableFields.includes(field))
  );

  if (!Object.keys(sanitizedPayload).length) {
    throw createHttpError(400, "No editable fields provided");
  }

  await suitecrmRequest({
    method: "PATCH",
    url: `/Api/V8/module/${module}/${id}`,
    data: {
      data: {
        type: module,
        id,
        attributes: sanitizedPayload
      }
    }
  });

  return getModuleRecord(module, id);
};
