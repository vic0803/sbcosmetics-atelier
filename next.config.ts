import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/sbcosmetics-atelier" : "";

const nextConfig: NextConfig = {
  ...(isGithubPages ? { output: "export", trailingSlash: true } : {}),
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
