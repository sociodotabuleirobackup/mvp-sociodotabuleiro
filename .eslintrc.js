module.exports = {
  root: true,
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  env: {
    node: true,
    es2022: true,
  },
  rules: {
    // General rules
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    // Prettier integration
    'prettier/prettier': 'error',
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '.next/',
    'build/',
    '*.config.js',
    '*.config.ts',
  ],
};
