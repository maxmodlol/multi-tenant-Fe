/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for production builds
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,
  trailingSlash: true,

  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Enhanced image configuration for production
  images: {
    domains: ["aktshf.s3.il-central-1.amazonaws.com"],
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Enable optimization for better performance, but handle SVGs carefully
    unoptimized: process.env.NODE_ENV === "production",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Ensure static assets are included in standalone builds
  outputFileTracingRoot: process.env.NODE_ENV === "production" ? __dirname : undefined,

  // expose any non‐NEXT_PUBLIC_ vars if you need them in server code
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    API_URL: process.env.API_URL,
  },

  // Enhanced static asset handling for production
  async rewrites() {
    if (process.env.NODE_ENV === "production") {
      return [
        // Static asset rewrites for production
        {
          source: "/icons/:path*",
          destination: "/icons/:path*",
        },
        {
          source: "/logo.svg",
          destination: "/logo.svg",
        },
        {
          source: "/_next/static/:path*",
          destination: "/_next/static/:path*",
        },
      ];
    }
    return [];
  },

  // Add headers for better asset caching
  async headers() {
    return [
      {
        source: "/icons/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/logo.svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Optional: if you want to rewrite every incoming host -> a path
  // Uncomment & adjust if you also have a `[tenant]` folder in `pages` or `app`
  /*
  async rewrites() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: ":subdomain.alnashra.co" }],
        destination: "/:subdomain/:path*",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "alnashra.co" }],
        destination: "/main/:path*",
      },
    ];
  },
  */
};

module.exports = nextConfig;
