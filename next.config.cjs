const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Configure cache directory
    config.cache = {
      type: 'filesystem',
      cacheDirectory: './.next/cache/webpack',
      buildDependencies: {
        config: [__filename]
      }
    };

    // Important: return the modified config
    return config;
  }
};

module.exports = nextConfig;
