const docsConfig = {
  // OpenAPI/Swagger Configuration
  swagger: {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Nebula API',
        version: '1.0.0',
        description: 'API Documentation for Nebula Project Management',
      },
      servers: [
        {
          url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
          description: 'API Server',
        },
      ],
    },
    apis: ['./app/api/**/*.ts', './app/api/**/*.js'],
    outputFile: './public/api-docs.json',
  },

  // JSDoc Configuration
  jsdoc: {
    source: {
      include: ['./app', './components', './lib'],
      exclude: ['node_modules', 'build', '.next'],
      includePattern: '.+\\.(js|jsx|ts|tsx)$',
    },
    opts: {
      destination: './docs/api',
      recurse: true,
      template: 'node_modules/better-docs',
    },
    plugins: [
      'plugins/markdown',
      'better-docs/component',
      'better-docs/typescript',
    ],
    templates: {
      better-docs: {
        name: 'Nebula Documentation',
      },
    },
  },

  // Documentation Testing Configuration
  testing: {
    links: {
      enabled: true,
      skipPatterns: ['http://localhost', 'https://example.com'],
    },
    swagger: {
      enabled: true,
      validateResponses: true,
    },
    typescript: {
      enabled: true,
      strict: true,
    },
  },

  // Markdown Documentation Configuration
  markdown: {
    source: './docs',
    output: './public/docs',
    templates: './docs/templates',
    hooks: {
      beforeGenerate: './scripts/docs/before-generate.js',
      afterGenerate: './scripts/docs/after-generate.js',
    },
  },

  // Version Control
  versioning: {
    enabled: true,
    dir: './docs/versions',
    latest: 'v1.0.0',
    versions: ['v1.0.0', 'v0.9.0'],
    generateDiff: true,
  },

  // Build and Deploy Configuration
  build: {
    outDir: './public/docs',
    clean: true,
    validate: true,
    checks: {
      brokenLinks: true,
      typescript: true,
      swagger: true,
    },
  },
};

module.exports = docsConfig;