import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  globalSetup: './src/test/setup.ts',
  globalTeardown: './src/test/teardown.ts',
  moduleNameMapper: {
    '@sommeliere/types': '<rootDir>/../../packages/types/src/index.ts',
  },
}

export default config
