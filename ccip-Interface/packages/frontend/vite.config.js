/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, './lib/index.ts'),
            name: '@chainlink/ccip-react-components',
            fileName: function (format) { return "index.".concat(format, ".js"); },
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
        // Skip type checking during build
        target: 'esnext',
        minify: 'esbuild',
    },
    plugins: [
        react({
            // Skip type checking in React plugin
            fastRefresh: true,
            // Don't check types
            typescript: {
                skipLibCheck: true,
                noEmit: true
            }
        })
    ],
    esbuild: {
        // Skip type checking in esbuild
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
});
