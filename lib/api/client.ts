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

function getBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  return baseUrl.replace(/\/$/, "");
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
      signal,
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...headers,
      },
    });
  } catch (error) {
    throw new ApiError(
      "Unable to reach the API. If this persists, check that the backend is running and CORS is configured for your frontend URL.",
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
