import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    globals: false,
    testTimeout: 30000, // PDF generation can be slow
  },
});
