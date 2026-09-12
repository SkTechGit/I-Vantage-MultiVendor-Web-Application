
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.1.5",
    "192.168.1.7",
    "192.168.*",
    "localhost:3000",
    "127.0.0.1:3000",
    "192.168.1.5:3000",
    "192.168.1.7:3000",
    "*.local",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;