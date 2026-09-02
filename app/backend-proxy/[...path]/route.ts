import { NextRequest, NextResponse } from "next/server";

import { resolveBackendBaseUrlFromEnv } from "@/lib/api/backend-url";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
]);

function buildBackendUrl(path: string[], search: string) {
  const backendBase = resolveBackendBaseUrlFromEnv();
  const targetPath = path.join("/");
  const url = new URL(
    targetPath,
    backendBase.endsWith("/") ? backendBase : `${backendBase}/`,
  );

  url.search = search;
  return url.toString();
}

function buildForwardHeaders(request: NextRequest) {
  const headers = new Headers();

  request.headers.forEach((value, key) => {
    if (HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      return;
    }

    headers.set(key, value);
  });

  return headers;
}

const DEFAULT_PROXY_TIMEOUT_MS = 15_000;
const AI_PROXY_TIMEOUT_MS = 120_000;
const MT5_REPAIR_PROXY_TIMEOUT_MS = 120_000;

function resolveProxyTimeoutMs(path: string[]): number {
  const joined = path.join("/");
  if (joined.startsWith("api/v1/ai")) {
    return AI_PROXY_TIMEOUT_MS;
  }
  if (joined === "api/v1/mt5/recalculate-trades") {
    return MT5_REPAIR_PROXY_TIMEOUT_MS;
  }
  return DEFAULT_PROXY_TIMEOUT_MS;
}

async function proxyRequest(request: NextRequest, path: string[]) {
  const targetUrl = buildBackendUrl(path, request.nextUrl.search);
  const method = request.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);
  const timeoutMs = resolveProxyTimeoutMs(path);
  const timeoutSignal =
    typeof AbortSignal.timeout === "function"
      ? AbortSignal.timeout(timeoutMs)
      : undefined;

  const response = await fetch(targetUrl, {
    method,
    headers: buildForwardHeaders(request),
    body: hasBody ? await request.arrayBuffer() : undefined,
    redirect: "manual",
    signal: timeoutSignal,
  });

  const responseHeaders = new Headers();

  response.headers.forEach((value, key) => {
    if (HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      return;
    }

    responseHeaders.set(key, value);
  });

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}
