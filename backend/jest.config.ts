import type { Config } from 'jest';

const config: Config = {
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { module: 'commonjs' } }],
  },
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  testTimeout: 30_000,
};

export default config;
