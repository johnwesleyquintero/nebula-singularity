let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  compress: true,
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-*', 'lucide-react'],
    turbo: {
      rules: {
        '*.svg': ['@svgr/webpack'],
        '*.mdx': ['@mdx-js/loader'],
      },
    },
  },
}

mergeConfig(nextConfig, userConfig)

// Remove deprecated swcMinify option
if (nextConfig.swcMinify !== undefined) {
  delete nextConfig.swcMinify;
}

function mergeConfig(nextConfig, userConfig)

// Remove deprecated swcMinify option
if (nextConfig.swcMinify !== undefined) {
  delete nextConfig.swcMinify;
} {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
