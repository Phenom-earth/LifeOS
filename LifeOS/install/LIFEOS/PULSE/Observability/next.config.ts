import type { NextConfig } from "next";

// Served behind a path prefix (code-server's /proxy/31337) when PULSE_BASEPATH is
// set at build time. Empty for the usual direct http://localhost:31337 install.
const basePath = (process.env.PULSE_BASEPATH ?? "").replace(/\/+$/, "")

const nextConfig: NextConfig = {
  output: "export",
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  env: { NEXT_PUBLIC_PULSE_BASEPATH: basePath },
  distDir: "out",
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  generateBuildId: () => `build-${Date.now()}`,
};

export default nextConfig;
