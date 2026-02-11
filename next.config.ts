import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  webpack(config) {
    config.module.rules.push({
      test: /\.md$/,
      type: "asset/source",
    });
    return config;
  },
  serverExternalPackages: ["pino", "pino-pretty"],
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
