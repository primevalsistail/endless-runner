import { defineConfig } from 'vite';

export default defineConfig({
  base: '/endless-runner/',
  server: {
    host: true,
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
