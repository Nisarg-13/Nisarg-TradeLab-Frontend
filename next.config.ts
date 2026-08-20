import type { NextConfig } from "next";

const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

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
