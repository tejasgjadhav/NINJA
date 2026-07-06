import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/NINJA",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
