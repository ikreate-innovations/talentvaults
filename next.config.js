/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    unoptimized: true,
  },

  // Remove or comment out these lines if they exist:
  // output: 'standalone',
  // distDir: '.next',
}

module.exports = nextConfig