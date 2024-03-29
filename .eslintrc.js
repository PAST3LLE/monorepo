const path = require('path')

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      // Allows for the parsing of JSX
      jsx: true
    },
    project: [
      // "./tsconfig.eslint.json",
      './apps/*/tsconfig.json',
      './packages/*/tsconfig.json',
      './examples/*/tsconfig.json'
    ]
  },
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  ignorePatterns: ['node_modules/**/*', '.github/*', 'build', 'dist', '.eslintrc.js', '.eslintrc.mjs', '*.config.js'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn', // or "error"
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }
    ],
    'object-shorthand': ['error', 'always'],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'lodash',
            message: "Please import from 'lodash/module' directly to support tree-shaking."
          },
          {
            name: '@lingui/macro',
            importNames: ['t'],
            message: 'Please use <Trans> instead of t.'
          }
        ],
        patterns: [
          {
            group: ['**/dist'],
            message: 'Do not import from dist/ - this is an implementation detail, and breaks tree-shaking.'
          }
        ]
      }
    ]
  }
}
