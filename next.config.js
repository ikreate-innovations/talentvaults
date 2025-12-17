/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  swcMinify: true,
  // ❌ COMMENTED OUT to enable logs in production for debugging
  // Re-enable this after debugging is complete for better production performance
  // ...(process.env.NODE_ENV === 'production' && {
  //   compiler: {
  //     removeConsole: true,
  //   },
  // }),
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV !== 'production',
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV !== 'production',
  },
  reactStrictMode: true,
};

module.exports = nextConfig;