import { fileURLToPath } from 'url';
import path from 'path';
// eslint-disable-next-line no-unused-vars
import fs from 'fs';
import { glob } from 'glob';
import { PurgeCSSPlugin } from 'purgecss-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { withSentryConfig } from '@sentry/nextjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.nebula-saas.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: securityHeaders,
    },
  ],
  publicRuntimeConfig: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN
  },
  webpack: (config, { dev, isServer }) => {
    // Set optimization options
    config.optimization = {
      minimize: !dev,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: {
              warnings: false,
              drop_console: !dev,
            },
          },
        })
      ],
      splitChunks: { chunks: 'all' },
    };

    // Add PurgeCSS in production server builds
    if (!dev && isServer) {
      const purgePaths = glob.sync(`${path.join(__dirname, 'src/**/*.{js,ts,jsx,tsx}')}`);
      config.plugins.push(
        new PurgeCSSPlugin({
          paths: purgePaths,
          safelist: {
            standard: ['body', 'html'],
          },
        })
      );
    }

    // Disable cache for better reliability
    config.cache = false;
    return config;
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
