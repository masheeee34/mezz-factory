import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // three.js ships ESM; transpiling keeps it happy across Next versions.
  transpilePackages: ["three"],
};

export default nextConfig;
