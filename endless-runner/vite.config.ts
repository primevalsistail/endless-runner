import { defineConfig } from 'vite';
import { execSync } from 'child_process';

const commitHash = execSync('git rev-parse --short HEAD').toString().trim();

export default defineConfig({
  base: '/endless-runner/',
  server: {
    host: true,
  },
  define: {
    __APP_VERSION__: JSON.stringify(commitHash),
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
