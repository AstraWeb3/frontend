import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5082", // Ensure this matches your backend's port
        pathname: "/GameImages/**",
      },
      {
        protocol: "https",
        hostname: "www.gravatar.com",
        pathname: "/avatar/**",
      },
    ],
    domains: ["cdn.dribbble.com", "images.scalebranding.com"],
  },
  reactStrictMode: false,
};

export default nextConfig;
