import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'], // Matches only *.test.ts and *.test.js

  // collectCoverage: true,
  // coverageDirectory: '<rootDir>/coverage',
  // collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
};

export default config;