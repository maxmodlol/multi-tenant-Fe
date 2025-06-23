/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["aktshf.s3.il-central-1.amazonaws.com"],
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
