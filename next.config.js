/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Disable Turbopack
    turbo: false
  },
  compress: true,
  poweredByHeader: false,
  // Add hostname configuration
  hostname: 'localhost',
  port: 3000,
  webpack: (config, { dev, isServer }) => {
    // Enable Fast Refresh
    if (dev) {
      config.optimization = {
        ...config.optimization,
        runtimeChunk: false,
        splitChunks: false,
      }
    }
    // Handle dynamic imports
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig; 