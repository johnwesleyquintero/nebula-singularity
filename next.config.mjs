import path from 'path';
import * as glob from 'glob';
import { PurgeCSSPlugin } from 'purgecss-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

const userConfig = (() => {
  try {
    return require('./v0-user-next.config');
  } catch (e) {
    console.warn('User configuration not found, proceeding with default settings.');
    // Optionally, you could return a default config here if needed.
    return null;
  }
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: false,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Optimization logic
    config.optimization = {
      minimize: true,
      minimizer: [new TerserPlugin()],
      splitChunks: { chunks: 'all' },
    };

    if (!dev && !isServer) {
      config.plugins.push(
        new PurgeCSSPlugin({
          paths: glob.sync(`${path.resolve('./app')}/**/*`, { nodir: true }),
          safelist: {
            standard: ['body', 'html'],
          },
        })
      );
    }

    return config;
  },
};

// Merge user config if it exists
if (userConfig) {
  mergeConfig(nextConfig, userConfig);
}

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) return;

  for (const key in userConfig) {
    if (typeof nextConfig[key] === 'object' && !Array.isArray(nextConfig[key])) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }
}

export default nextConfig;
