import createMDX from '@next/mdx'
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "api.microlink.io" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
