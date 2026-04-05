/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@siriux/core', '@siriux/auth', '@siriux/ui', '@siriux/access-control', '@siriux/logging', '@siriux/config'],
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      child_process: false
    };
    return config;
  }
};

module.exports = nextConfig;
