import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["cdn.dribbble.com", "images.scalebranding.com"],
  },
  reactStrictMode: false,
};

export default nextConfig;
