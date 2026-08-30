import { resolveBackendBaseUrlFromEnv } from "@/lib/api/backend-url";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ApiClientOptions = {
  baseUrl?: string;
  getAuthToken?: () => Promise<string | null>;
  signal?: AbortSignal;
};

const BACKEND_PROXY_PREFIX = "/backend-proxy";
const DEFAULT_API_TIMEOUT_MS = 10_000;

function mergeAbortSignals(
  ...signals: Array<AbortSignal | undefined>
): AbortSignal | undefined {
  const active = signals.filter(Boolean) as AbortSignal[];

  if (active.length === 0) {
    return undefined;
  }

  if (active.length === 1) {
    return active[0];
  }

  const controller = new AbortController();

  for (const signal of active) {
    if (signal.aborted) {
      controller.abort(signal.reason);
      return controller.signal;
    }

    signal.addEventListener("abort", () => controller.abort(signal.reason), {
      once: true,
    });
  }

  return controller.signal;
}

function createRequestTimeoutSignal(): AbortSignal | undefined {
  if (typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(DEFAULT_API_TIMEOUT_MS);
  }

  return undefined;
}

function resolveBackendBaseUrl(): string {
  return resolveBackendBaseUrlFromEnv();
}

function getBaseUrl(): string {
  // Browser calls use same-origin proxy so CORS never blocks client actions.
  if (typeof window !== "undefined") {
    return BACKEND_PROXY_PREFIX;
  }

  return resolveBackendBaseUrl();
}

export async function apiRequest<T>(
  path: string,
  options: ApiClientOptions & RequestInit = {},
): Promise<T> {
  const { getAuthToken, baseUrl, signal, headers, ...init } = options;
  const url = `${baseUrl ?? getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const authToken = getAuthToken ? await getAuthToken() : null;

  let response: Response;

  try {
    response = await fetch(url, {
      ...init,
      signal: mergeAbortSignals(signal, createRequestTimeoutSignal()),
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...headers,
      },
    });
  } catch (error) {
    const backendUrl = resolveBackendBaseUrl();
    const timedOut =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");

    throw new ApiError(
      timedOut
        ? `API request timed out after ${DEFAULT_API_TIMEOUT_MS / 1000}s at ${backendUrl}. Is the FastAPI backend running on port 3001?`
        : `Unable to reach the API at ${backendUrl}. If this persists, verify NEXT_PUBLIC_API_BASE_URL and that the FastAPI backend is running.`,
      0,
      error,
    );
  }

  const contentType = response.headers.get("content-type");
  const body = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new ApiError(
      formatApiErrorMessage(body, response.status),
      response.status,
      body,
    );
  }

  return body as T;
}

function formatApiErrorMessage(body: unknown, status: number): string {
  if (typeof body !== "object" || !body) {
    return `Request failed with status ${status}`;
  }

  const record = body as {
    message?: unknown;
    error?: unknown;
  };

  if (typeof record.message === "string") {
    return record.message;
  }

  if (
    typeof record.message === "object" &&
    record.message &&
    "details" in record.message
  ) {
    const details = (
      record.message as { details?: { fieldErrors?: Record<string, string[]> } }
    ).details;

    if (details?.fieldErrors) {
      const messages = Object.entries(details.fieldErrors).flatMap(
        ([field, errors]) => errors.map((error) => `${field}: ${error}`),
      );

      if (messages.length > 0) {
        return messages.join(" ");
      }
    }
  }

  if (
    typeof record.message === "object" &&
    record.message &&
    "fieldErrors" in record.message
  ) {
    const fieldErrors = (
      record.message as { fieldErrors?: Record<string, string[]> }
    ).fieldErrors;

    if (fieldErrors) {
      const messages = Object.entries(fieldErrors).flatMap(([field, errors]) =>
        errors.map((error) => `${field}: ${error}`),
      );

      if (messages.length > 0) {
        return messages.join(" ");
      }
    }
  }

  if (typeof record.error === "string") {
    return record.error;
  }

  return `Request failed with status ${status}`;
}

export async function getHealth() {
  return apiRequest<{ status: string; service: string; timestamp: string }>(
    "/health",
  );
}
