import axios, { AxiosInstance, AxiosRequestConfig, Method } from "axios";
import createHttpError from "http-errors";
import { config } from "../config/env.js";
import { SuiteCRMTokenResponse } from "../types/suitecrm.js";

type CachedToken = {
  token: string;
  expiresAt: number;
};

let cachedToken: CachedToken | null = null;

const suitecrmAxios: AxiosInstance = axios.create({
  baseURL: config.suitecrm.baseUrl,
  headers: {
    "Content-Type": "application/json"
  }
});

const tokenEndpoint = `${config.suitecrm.baseUrl}/Api/access_token`;

const isTokenValid = (token: CachedToken | null) => {
  if (!token) return false;
  return token.expiresAt > Date.now() + 30 * 1000; // refresh 30s before expiry
};

export const getAccessToken = async (): Promise<string> => {
  if (isTokenValid(cachedToken)) {
    return cachedToken!.token;
  }

  try {
    const response = await axios.post<SuiteCRMTokenResponse>(tokenEndpoint, {
      grant_type: config.suitecrm.grantType,
      client_id: config.suitecrm.clientId,
      client_secret: config.suitecrm.clientSecret
    });

    const { access_token, expires_in } = response.data;
    cachedToken = {
      token: access_token,
      expiresAt: Date.now() + expires_in * 1000
    };

    return access_token;
  } catch (error) {
    throw createHttpError(502, "Failed to authenticate with SuiteCRM");
  }
};

type RequestOptions = {
  method: Method;
  url: string;
  data?: unknown;
  params?: Record<string, unknown>;
  config?: AxiosRequestConfig;
};

export const suitecrmRequest = async <T>({
  method,
  url,
  data,
  params,
  config: customConfig
}: RequestOptions): Promise<T> => {
  const accessToken = await getAccessToken();

  try {
    const response = await suitecrmAxios.request<T>({
      method,
      url,
      data,
      params,
      ...customConfig,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        ...(customConfig?.headers || {})
      }
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const detail =
        (error.response?.data as { errors?: Array<{ detail?: string }>; message?: string })?.errors?.[0]?.detail ||
        (error.response?.data as { message?: string })?.message ||
        error.message;

      throw createHttpError(status, detail || "SuiteCRM API request failed");
    }

    throw createHttpError(500, "Unexpected error calling SuiteCRM API");
  }
};
