import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Wildcard to allow any hostname
      },
      {
        protocol: 'http',
        hostname: '**', // Include this if you need to support HTTP images
      },
    ],
  },
};

export default nextConfig;
