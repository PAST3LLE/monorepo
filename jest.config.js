const componentsPkg = require('./packages/components/package.json')
const hooksPkg = require('./packages/hooks/package.json')
const themePkg = require('./packages/theme/package.json')
const utilsPkg = require('./packages/utils/package.json')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  testPathIgnorePatterns: [".d.ts", ".js"],
  projects: [
    {
      preset: 'ts-jest',
      displayName: componentsPkg.name,
      testMatch: ['<rootDir>/packages/components/src/__tests__/?(*.)+(spec|test).ts?(x)'],
    },
    {
      preset: 'ts-jest',
      displayName: hooksPkg.name,
      testMatch: ['<rootDir>/packages/hooks/src/__tests__/?(*.)+(spec|test).ts?(x)'],
    },
    {
      preset: 'ts-jest',
      displayName: themePkg.name,
      testMatch: ['<rootDir>/packages/theme/src/__tests__/?(*.)+(spec|test).ts?(x)'],
    },
    {
      preset: 'ts-jest',
      displayName: utilsPkg.name,
      testMatch: ['<rootDir>/packages/utils/src/__tests__/?(*.)+(spec|test).ts?(x)'],
    }
  ],
};