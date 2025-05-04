import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    productionBrowserSourceMaps: true, // Enable source maps in prod to trace errors
    reactStrictMode: true,             // Catch common issues early
    experimental: {
      // Optional: helps narrow down dynamic behavior if you're using Turbopack
      // turbo: true,
    },
}

export default nextConfig;
