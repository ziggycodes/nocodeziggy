import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    return [
      { source: "/coreloop", destination: "/coreloop.html" },
      { source: "/coreloop/", destination: "/coreloop.html" },
    ];
  },
  async redirects() {
    return [
      {
        source: "/coreloop.html",
        destination: "/coreloop",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
