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

  const response = await fetch(url, {
    ...init,
    signal,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
  });

  const contentType = response.headers.get("content-type");
  const body = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new ApiError(
      typeof body === "object" && body && "message" in body
        ? String((body as { message: unknown }).message)
        : `Request failed with status ${response.status}`,
      response.status,
      body,
    );
  }

  return body as T;
}

export async function getHealth() {
  return apiRequest<{ status: string; service: string; timestamp: string }>(
    "/health",
  );
}
