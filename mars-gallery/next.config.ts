import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["mars.nasa.gov", "placehold.co"],
  },
};

export default nextConfig;
