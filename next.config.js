/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Allow production builds to successfully complete even if there are type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors during builds to prevent blocking deploys.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'files.stripe.com',
      },
    ],
  },
  reactStrictMode: false,
  experimental: {
    serverActions: {
      // Allow all localhost ports for development (3000, 3001, 3002, etc.)
      allowedOrigins: [
        'localhost:3000',
        'localhost:3001',
        'localhost:3002',
        'localhost:3003',
        'localhost:3004',
        'localhost:3005',
      ],
    },
  },
}

module.exports = nextConfig
