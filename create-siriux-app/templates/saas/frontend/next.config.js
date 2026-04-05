/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@siriux/core', '@siriux/auth', '@siriux/ui'],
};

module.exports = nextConfig;
