/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import tailwindcss from '@tailwindcss/vite';
import type { UserConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vite.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  const isBundled = mode === 'bundled';
  const isReact = mode === 'react';
  const outDir = isBundled
    ? 'dist/bundled'
    : isReact
      ? 'dist/react'
      : 'dist/preact';

  const baseAlias = {
    '@': path.resolve(__dirname, './src'),
  };

  return {
    plugins: [
      tailwindcss(),
      isReact ? react() : preact(),
      mode === 'bundled' && cssInjectedByJsPlugin(),
      dts({
        outDir: 'dist/types',
        insertTypesEntry: true,
      }),
    ],
    define: {
      'process.env': { NODE_ENV: 'production' },
    },
    resolve: {
      alias: isReact
        ? {
            ...baseAlias,
            'preact/compat': resolve(
              __dirname,
              'src/shims/react-compat-shim.js'
            ),
            'preact/jsx-runtime': 'react/jsx-runtime',
            'preact/hooks': 'react',
            'preact/test-utils': 'react-dom/test-utils',
            'preact/debug': 'react',
            preact: 'react',
          }
        : baseAlias,
    },
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'hello-csv',
        formats: ['es', 'cjs', 'umd'],
        fileName: (format) => `index.${format}.js`,
      },
      rollupOptions: {
        external: isBundled
          ? []
          : isReact
            ? ['react', 'react-dom']
            : ['preact'],
        output: {
          globals: isBundled
            ? {}
            : {
                preact: isReact ? 'React' : 'Preact',
                react: 'React',
                'react-dom': 'ReactDOM',
              },
        },
      },
      outDir,
    },
  };
});
