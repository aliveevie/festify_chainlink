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
            external: [
                'react', 
                'react-dom', 
                'tailwindcss',
                'react-hook-form',
                '@hookform/resolvers',
                '@hookform/resolvers/zod',
                'zod',
                'wagmi',
                'viem',
                'lucide-react',
                '@radix-ui/react-select',
                '@radix-ui/react-slot',
                '@radix-ui/react-dialog',
                '@radix-ui/react-dropdown-menu',
                '@radix-ui/react-label',
                '@radix-ui/react-toast',
                'class-variance-authority',
                'clsx',
                'tailwind-merge',
                'tailwindcss-animate'
            ],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    tailwindcss: 'tailwindcss',
                    'react-hook-form': 'ReactHookForm',
                    '@hookform/resolvers': 'HookformResolvers',
                    '@hookform/resolvers/zod': 'HookformResolversZod',
                    'zod': 'Zod',
                    'wagmi': 'Wagmi',
                    'viem': 'Viem',
                    'lucide-react': 'LucideReact',
                    '@radix-ui/react-select': 'RadixSelect',
                    '@radix-ui/react-slot': 'RadixSlot',
                    '@radix-ui/react-dialog': 'RadixDialog',
                    '@radix-ui/react-dropdown-menu': 'RadixDropdownMenu',
                    '@radix-ui/react-label': 'RadixLabel',
                    '@radix-ui/react-toast': 'RadixToast',
                    'class-variance-authority': 'ClassVarianceAuthority',
                    'clsx': 'Clsx',
                    'tailwind-merge': 'TailwindMerge',
                    'tailwindcss-animate': 'TailwindAnimate'
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
