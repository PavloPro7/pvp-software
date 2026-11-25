import type { NextConfig } from "next";

// The site is exported as plain files (the "out" folder) and hosted on GitHub
// Pages, which cannot run server code.
//
// On GitHub Pages the site lives under a sub-path (/pvp-software). The deploy
// workflow passes that path in NEXT_PUBLIC_BASE_PATH. On your computer it is
// empty, so `npm run dev` keeps working at http://localhost:3000.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // Every page becomes <page>/index.html, which any static host can serve.
  trailingSlash: true,
  // Resizing images on the fly needs a server; images are served as they are.
  images: { unoptimized: true },
};

export default nextConfig;
