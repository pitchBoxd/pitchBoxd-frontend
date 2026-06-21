const isServer = typeof window === "undefined";

const SERVER_BASE =
  (typeof process !== "undefined" && process.env?.VITE_API_BASE_URL) ||
  "http://localhost:8080";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function resolveUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return isServer ? `${SERVER_BASE}${normalized}` : normalized;
}

export interface SuccessResponse<T> {
  status: number;
  data: T;
}

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  searchParams?: Record<string, string | number | boolean | undefined | null>;
}

let reissuePromise: Promise<unknown> | null = null;

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, searchParams, headers, ...init } = options;

  let url = resolveUrl(path);
  if (searchParams) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value === undefined || value === null) continue;
      qs.set(key, String(value));
    }
    const query = qs.toString();
    if (query) url += `${url.includes("?") ? "&" : "?"}${query}`;
  }

  const authHeaders: Record<string, string> = {};
  if (!isServer) {
    const token = getCookie("accessToken");
    if (token) {
      authHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...authHeaders,
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  const text = await response.text();
  const payload = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    if (response.status === 401 && !path.includes("/auth/reissue")) {
      if (!reissuePromise) {
        reissuePromise = request("/api/v1/auth/reissue", { method: "POST" })
          .finally(() => {
            reissuePromise = null;
          });
      }
      try {
        await reissuePromise;
        return await request<T>(path, options);
      } catch (reissueError) {
        throw new ApiError(
          response.status,
          payload,
          `Request to ${path} failed with 401 and token reissue failed`,
        );
      }
    }

    throw new ApiError(
      response.status,
      payload,
      `Request to ${path} failed with ${response.status}`,
    );
  }

  if (payload && typeof payload === "object" && "data" in (payload as object)) {
    return (payload as SuccessResponse<T>).data;
  }
  return payload as T;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST" }),
  patch: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH" }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
