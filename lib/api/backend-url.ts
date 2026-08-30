/** Uvicorn binds IPv4 only; Node may resolve localhost to ::1 on macOS. */
export function normalizeBackendBaseUrl(baseUrl: string): string {
  return baseUrl
    .trim()
    .replace(/\/$/, "")
    .replace("://localhost", "://127.0.0.1");
}

export function resolveBackendBaseUrlFromEnv(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  return normalizeBackendBaseUrl(baseUrl);
}
