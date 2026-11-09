
import type { NextConfig } from "next";
import path from "path";

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/v1";
const cleanApiUrl = rawApiUrl.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.1.4",
    "192.168.1.5",
    "192.168.1.6",
    "192.168.1.7",
    "192.168.8.41",
    "*.trycloudflare.com",
    "harris-princess-expertise-uniprotkb.trycloudflare.com",
    "answer-logo-consider-magnificent.trycloudflare.com",
    "poison-transcript-academic-organizations.trycloudflare.com",
    "craig-knows-dietary-applies.trycloudflare.com",
    "roll-weblog-trademark-label.trycloudflare.com",
    "*.loca.lt",
    "localhost:3000",
    "127.0.0.1:3000",
    "localhost:3001",
    "127.0.0.1:3001",
    "192.168.1.4:3000",
    "192.168.1.5:3000",
    "192.168.1.6:3000",
    "192.168.1.7:3000",
    "192.168.8.41:3000",
    "*.local",
  ],
  images: {
    unoptimized: process.env.NODE_ENV !== "production",
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source:
          "/gurugram/day-pass/i-vantage-business-hub-or-coworking-day-pass-in-gurgaon-or-coworking-day-pass-in-gurgaon-sector-48-sohna-road",
        destination: "/gurugram/day-pass/ivantage-day-pass-sector-48",
        permanent: true,
      },
      {
        source:
          "/gurugram/coworking-seat/i-vantage-business-hub-or-coworking-space-in-welldone-tech-park-or-premium-coworking-space-in-gurgaon-sector-48-sohna-road",
        destination: "/gurugram/coworking-seat/ivantage-coworking-welldone-tech-park",
        permanent: true,
      },
      {
        source:
          "/gurugram/meeting-room/i-vantage-business-hub-or-on-demand-meeting-room-in-welldone-tech-park-or-6-seater-meeting-room-in-gurgaon",
        destination: "/gurugram/meeting-room/ivantage-meeting-room-welldone-tech-park",
        permanent: true,
      },
      {
        source:
          "/noida/coworking-seat/get-set-office-sector-63-noida-or-premium-coworking-space-and-virtual-office",
        destination: "/noida/coworking-seat/get-set-office-sector-63-noida",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${cleanApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;