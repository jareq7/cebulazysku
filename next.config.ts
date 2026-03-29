import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ndhcyrivrvoagfyqewfm.supabase.co",
      },
      {
        protocol: "https",
        hostname: "leadstar.pl",
      },
      {
        protocol: "https",
        hostname: "**.leadstar.pl",
      },
    ],
  },
};

export default nextConfig;
