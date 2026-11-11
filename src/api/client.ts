import type { ErrorResponse } from "../types/api";

export const BASE_URL: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";

// Thrown for every failed request. Carries the backend's message and fieldErrors.
export class ApiError extends Error {
  status: number; // 0 = server not reachable
  fieldErrors: Record<string, string>;
  path: string | undefined;

  // Fields are declared above (not as constructor parameter properties)
  // because the Vite template enables erasableSyntaxOnly.
  constructor(
    status: number,
    message: string,
    fieldErrors: Record<string, string> = {},
    path?: string,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.path = path;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue>;

function buildQuery(params?: QueryParams): string {
  if (!params) return "";
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    qs.set(key, String(value));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  params?: QueryParams;
}

async function request<T>(
  path: string,
  { method = "GET", body, params }: RequestOptions = {},
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}${buildQuery(params)}`, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      0,
      `Cannot reach the server at ${BASE_URL}. Is the backend running?`,
    );
  }

  // Some endpoints (delete project, remove member, delete comment) return an empty body.
  const text = await res.text();
  let data: unknown;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = undefined;
    }
  }

  if (!res.ok) {
    const err = data as Partial<ErrorResponse> | undefined;
    throw new ApiError(
      res.status,
      err?.message ?? `Request failed (HTTP ${res.status})`,
      err?.fieldErrors ?? {},
      err?.path,
    );
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, params?: QueryParams) => request<T>(path, { params }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  delete: <T = void>(path: string) => request<T>(path, { method: "DELETE" }),
};