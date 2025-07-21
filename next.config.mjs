/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
  // Add production settings to minimize errors related to circular dependencies
  reactStrictMode: false, // Disable strict mode in production to avoid double-invoking effects
  swcMinify: true, // Use SWC for minification
  compiler: {
    // Suppress specific errors in production
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  }
};

export default nextConfig;
