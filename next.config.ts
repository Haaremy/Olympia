import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    productionBrowserSourceMaps: false, // Enable source maps in prod to trace errors
    reactStrictMode: true,             // Catch common issues early
    allowedDevOrigins: ["http://10.0.2.12:3000", "http://10.0.1.89:3000", "192.168.56.1:3000"], // Allow these origins during development
    experimental: {
      // Optional: helps narrow down dynamic behavior if you're using Turbopack
      // turbo: true,
      
    },
}

export default nextConfig;
