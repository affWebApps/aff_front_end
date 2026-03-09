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
  async rewrites() {
    return [
      {
        source: '/ai-studio2/:path*',
        destination: 'https://ai-design-studio-blush.vercel.app/:path*', // The actual URL of your studio
      },
    ]
  },
};

export default nextConfig;
