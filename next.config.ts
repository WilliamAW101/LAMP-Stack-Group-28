import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    REMOTE_URL: process.env.REMOTE_URL,
  },
  trailingSlash: true,
  images: {
    unoptimized: true
  },
};

export default nextConfig;
