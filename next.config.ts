import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    productionBrowserSourceMaps: false, // Enable source maps in prod to trace errors
    reactStrictMode: true,             // Catch common issues early
    allowedDevOrigins: ["http://10.0.2.12:3000"],
    experimental: {
      // Optional: helps narrow down dynamic behavior if you're using Turbopack
      // turbo: true,
      
    },
}

export default nextConfig;
