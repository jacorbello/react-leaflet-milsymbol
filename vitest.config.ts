import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      // Coverage measures the published library — everything reachable from the
      // src/index.ts entry that vite.config.ts builds. The demo app is a GitHub
      // Pages site that ships in no package; counting its JSX in the same number
      // makes the gate report on the wrong thing. The demo still has its own
      // tests (demo-sidc, demo-app), they just don't move this metric.
      exclude: [
        'src/demo/**',
        'src/App.tsx',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/__tests__/**',
        '**/*.config.*',
        '**/*.css',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
