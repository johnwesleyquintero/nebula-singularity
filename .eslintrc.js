module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  root: true,
  settings: {
    react: {
      version: 'detect'
    },
    next: {
      rootDir: "."
    }
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-undef': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-redeclare': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-unsafe-function-type': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    'react/no-unknown-property': ['error', {
      ignore: ['cmdk-input-wrapper']
    }],
    'no-unused-vars': 'off',
    'react/jsx-uses-react': 'off'
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  globals: {
    React: 'writable',
    JSX: 'readonly',
    NodeJS: 'readonly',
    HTMLUListElement: 'readonly',
    KeyboardEvent: 'readonly',
    Event: 'readonly',
    Metadata: 'readonly',
    FormControl: 'readonly',
    FormField: 'readonly',
    FormItem: 'readonly',
    FormLabel: 'readonly',
    FormDescription: 'readonly',
    FormMessage: 'readonly',
    Checkbox: 'readonly',
    Buffer: 'readonly',
    TextEncoder: 'readonly',
    crypto: 'readonly',
    console: 'readonly',
    Response: 'readonly'
  }
};
