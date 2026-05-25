import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['components/**/*.test.ts', 'lib/**/*.test.ts'],
    exclude: ['node_modules/**', '.next/**', 'archive/**'],
  },
})
