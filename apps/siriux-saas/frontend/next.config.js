/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standard server deployment for EC2
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
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
