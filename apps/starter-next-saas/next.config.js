/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@siriux/core', '@siriux/auth', '@siriux/ui', '@siriux/access-control', '@siriux/logging', '@siriux/config'],
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
  },
  // Force client-side rendering
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },
  // Disable all SSR features
  experimental: {
    ssr: false
  }
};

module.exports = nextConfig;
