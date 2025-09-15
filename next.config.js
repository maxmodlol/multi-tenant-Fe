/** @type {import('next').NextConfig} */
const nextConfig = {
  // produce a standalone server bundle that Plesk / Passenger can run directly
  // Only use standalone in production and when not on Windows
  ...(process.env.NODE_ENV === "production" &&
    process.platform !== "win32" && {
      output: "standalone",
      // Ensure static assets are included in standalone build
      trailingSlash: false,
      // Copy public assets to standalone build
      experimental: {
        outputFileTracingRoot: process.cwd(),
      },
    }),

  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    domains: ["aktshf.s3.il-central-1.amazonaws.com"],
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Ensure SVG icons are properly handled
    unoptimized: false,
  },

  // expose any non‐NEXT_PUBLIC_ vars if you need them in server code
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    API_URL: process.env.API_URL,
  },

  // Ensure static assets are properly served
  async rewrites() {
    return [
      // Fallback for static assets in standalone builds
      {
        source: "/icons/:path*",
        destination: "/icons/:path*",
      },
      {
        source: "/:path*",
        destination: "/:path*",
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
