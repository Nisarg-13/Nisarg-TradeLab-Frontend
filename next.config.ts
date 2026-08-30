import type { NextConfig } from "next";

import { normalizeBackendBaseUrl } from "./lib/api/backend-url";

const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  ? normalizeBackendBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL)
  : undefined;

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async rewrites() {
    if (!backendUrl) {
      return [];
    }

    return [
      {
        source: "/backend-proxy/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
