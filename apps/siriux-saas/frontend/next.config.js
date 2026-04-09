/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config, { isServer }) => {
    // Fixes the "use client" directive issue
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      child_process: false,
      tls: false,
      'node:buffer': false,
      'node:perf_hooks': false,
      'node:child_process': false
    };
    config.externals = {
      'snowflake-sdk': 'commonjs snowflake-sdk'
    };
    return config;
  }
};

module.exports = nextConfig;
