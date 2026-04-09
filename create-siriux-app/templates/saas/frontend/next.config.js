/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@siriux/core', '@siriux/auth'],
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      child_process: false,
      tls: false,
      'node:buffer': false,
      'node:perf_hooks': false,
    };
    return config;
  },
};

module.exports = nextConfig;
