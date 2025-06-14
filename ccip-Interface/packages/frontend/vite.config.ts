/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  server: {
    port: 5173,
    open: true,
  },
  build: {
    lib: {
      entry: resolve(__dirname, './lib/index.ts'),
      name: '@chainlink/ccip-react-components',
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'tailwindcss'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          tailwindcss: 'tailwindcss',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
    target: 'esnext',
    minify: 'esbuild',
  },
  plugins: [
    react(),
    dts({ 
      rollupTypes: true,
      include: [],
      exclude: ['**/*.ts', '**/*.tsx']
    }),
  ],
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    legalComments: 'none',
    treeShaking: true,
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './lib'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './lib/tests/setup.ts',
    coverage: {
      provider: 'v8',
      include: ['**/lib/**'],
      exclude: [
        '**/lib/components/ui/**',
        '**/lib/components/svg/**',
        '**/*{.,-}{test,spec,bench,benchmark}?(-d).?(c|m)[jt]s?(x)',
      ],
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  // Add development entry point
  ...(command === 'serve' && {
    root: './lib',
    publicDir: '../public',
    build: {
      outDir: '../dist',
    },
  }),
}));
