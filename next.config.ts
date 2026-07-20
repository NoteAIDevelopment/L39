import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "videos.pexels.com" },
      { protocol: "https", hostname: "cdn.jetphotos.com" },
      { protocol: "https", hostname: "live.staticflickr.com" },
    ],
  },
};

export default nextConfig;
