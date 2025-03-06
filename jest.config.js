module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.m?js$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'mjs', 'ts'],
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)",
    "**/?(*.)+(spec|test).mjs"
  ],
  moduleNameMapper: {
    // Add any module name mappings if needed
  },
  transformIgnorePatterns: [
    "/node_modules/(?!your-esm-module/)"
  ],
};
