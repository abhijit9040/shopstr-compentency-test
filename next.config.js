/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  compress: true,
  poweredByHeader: false,
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.optimization = {
        ...config.optimization,
        runtimeChunk: false,
        splitChunks: false,
      }
    }
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