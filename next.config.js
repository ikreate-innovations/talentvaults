/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      // Add your Netlify domain for optimized images
      {
        protocol: 'https',
        hostname: 'talentvaults.netlify.app',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    // Optimize images for Netlify
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  
  // Build optimization
  swcMinify: true,
  reactStrictMode: true,
  
  // Production optimizations (enabled now for deployment)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // TypeScript and ESLint handling for production builds
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV !== 'production',
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV !== 'production',
  },
  
  // Enable trailing slashes for Netlify compatibility
  trailingSlash: false,
  
  // Output configuration - IMPORTANT: NO standalone for Netlify
  // REMOVE any output: 'standalone' or output: 'export' lines
  // Netlify's plugin handles this automatically
  
  // Cache headers for static assets
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/public/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Enable runtime environment variables
  env: {
    SITE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://talentvaults.netlify.app' 
      : 'http://localhost:3000',
  },
  
  // Enable source maps in development only
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;