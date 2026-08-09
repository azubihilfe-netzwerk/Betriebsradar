import type { Config } from 'jest';

const config: Config = {
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { module: 'commonjs' } }],
    '^.+\\.jsx?$': 'babel-jest',
  },
  // @keystone-6/* ship ESM-only builds; transpile them to CJS for Jest instead
  // of the rest of node_modules, which is left untouched.
  transformIgnorePatterns: ['/node_modules/(?!(@keystone-6|@babel/runtime)/)'],
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  testTimeout: 30_000,
};

export default config;
