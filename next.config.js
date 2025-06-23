/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    domains: ["aktshf.s3.il-central-1.amazonaws.com"],
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
