// ════════════════════════════════════════════════════════════
// Vitest Config — Test runner
// ════════════════════════════════════════════════════════════
// Aktive etmek için:
//   npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
// Çalıştır:
//   npm test
// Detay: docs/TESTING.md
// ════════════════════════════════════════════════════════════

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.js'],
    globals: true,
    include: ['test/**/*.test.{js,jsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
