import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  // Ensure proper routing and SSR
  trailingSlash: false,

  // Optimization for better development experience
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },

  // ESLint configuration to allow builds with warnings
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
