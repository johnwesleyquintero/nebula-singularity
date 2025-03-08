import { fileURLToPath } from 'url';
import path from 'path';
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
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  experimental: {}, // Remove deprecated appDir option
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['nebula-saas.com', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.nebula-saas.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: securityHeaders,
    },
  ],
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_ENABLE_SENTRY: String(process.env.NODE_ENV === 'production'),
    NEXT_PUBLIC_IMAGE_DOMAIN: process.env.NEXT_PUBLIC_IMAGE_DOMAIN
  },
  webpack: (config, { dev, isServer }) => {
    config.resolve.fallback = { fs: false, net: false };
    if (!dev) {
      config.optimization = {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            parallel: true,
            terserOptions: {
              compress: {
                drop_console: true,
                drop_debugger: true
              },
            },
          })
        ],
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    if (!dev && isServer) {
      const purgePaths = glob.sync(`${path.join(__dirname, '{src,app,components}/**/*.{js,ts,jsx,tsx}')}`);
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
