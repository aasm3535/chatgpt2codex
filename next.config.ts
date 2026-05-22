import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vercel.com",
        pathname: "/button",
      },
    ],
  },
};

export default nextConfig;
