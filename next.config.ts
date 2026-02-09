import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  headers: async () => [
    {
      source: "/api/:path*",
      headers: [
        {
          key: "Access-Control-Allow-Origin",
          value: process.env.NEXT_PUBLIC_APP_URL || "",
        },
        { key: "Access-Control-Allow-Methods", value: "GET, POST" },
        {
          key: "Access-Control-Allow-Headers",
          value: "Content-Type",
        },
      ],
    },
  ],
};

export default nextConfig;
