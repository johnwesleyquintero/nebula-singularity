import path from 'path';
import { PurgeCSSPlugin } from 'purgecss-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

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
    config.optimization = {
      minimize: true,
      minimizer: [new TerserPlugin()],
      splitChunks: { chunks: 'all' },
    };

    if (!dev && !isServer) {
      config.plugins.push(
        new PurgeCSSPlugin({
          paths: [
            path.join(__dirname, 'app/**/*.{js,jsx,ts,tsx}'),
            path.join(__dirname, 'components/**/*.{js,jsx,ts,tsx}'),
            path.join(__dirname, 'pages/**/*.{js,jsx,ts,tsx}'),
          ],
          safelist: {
            standard: ['body', 'html'],
          },
        })
      );
    }

    return config;
  },
};

export default nextConfig;
