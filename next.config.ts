import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    REMOTE_URL: process.env.REMOTE_URL,
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/LAMP-Stack-Group-28' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/LAMP-Stack-Group-28/' : '',
};

export default nextConfig;
