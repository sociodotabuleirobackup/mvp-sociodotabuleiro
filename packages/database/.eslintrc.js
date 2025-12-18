module.exports = {
  extends: ['../../.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-unused-vars': 'off', // Disable base rule for TypeScript
    'no-console': 'off', // Allow console in seed scripts
  },
  overrides: [
    {
      files: ['prisma/seed.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off', // Allow unused vars in seed file
      },
    },
  ],
};