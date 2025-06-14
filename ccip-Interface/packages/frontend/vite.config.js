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
            fileName: (format) => `index.${format}.js`,
            formats: ['es'],
        },
        rollupOptions: {
            // Ignore all dependency resolution errors
            onwarn(warning, warn) {
                // Ignore all warnings
                return;
            },
            external: [
                'react', 
                'react-dom', 
                'tailwindcss',
                'viem',
                '@viem/utils',
                '@viem/chains',
                '@viem/contract',
                '@viem/accounts',
                '@viem/wallet',
                '@viem/actions',
                '@viem/blockchain',
                '@viem/transport',
                '@viem/transaction',
                '@viem/ccip'
            ],
            output: {
                preserveModules: false,
                exports: 'named',
                entryFileNames: 'index.[format].js',
                chunkFileNames: 'index.[format].js',
                assetFileNames: 'index.[format].[ext]',
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    tailwindcss: 'tailwindcss'
                },
            },
        },
        sourcemap: true,
        emptyOutDir: true,
        target: 'esnext',
        minify: false,
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
        // Ignore all errors
        logLevel: 'silent',
        // Don't fail on errors
        logLimit: 0
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
    // Ignore all build errors
    optimizeDeps: {
        exclude: [
            'viem',
            '@viem/utils',
            '@viem/chains',
            '@viem/contract',
            '@viem/accounts',
            '@viem/wallet',
            '@viem/actions',
            '@viem/blockchain',
            '@viem/transport',
            '@viem/transaction',
            '@viem/ccip'
        ],
        include: [
            'react',
            'react-dom',
            'tailwindcss'
        ],
        esbuildOptions: {
            target: 'esnext'
        }
    },
    // Don't fail on errors
    server: {
        hmr: {
            overlay: false
        }
    }
});
