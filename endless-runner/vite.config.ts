import { defineConfig } from 'vite';
import pkg from './package.json';

export default defineConfig({
  base: '/endless-runner/',
  server: {
    host: true,
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
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
