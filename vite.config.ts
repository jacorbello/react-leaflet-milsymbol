import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import pkg from './package.json';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      rollupTypes: true,
      clearPureImport: true,
      staticImport: true,
      outDir: 'dist',
      bundledPackages: Object.keys(pkg.peerDependencies || {}),
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactLeafletMilsymbol',
      formats: ['es', 'umd'],
      fileName: (format) => `react-leaflet-milsymbol.${format}.js`,
    },
    rollupOptions: {
      external: [
        ...Object.keys(pkg.peerDependencies || {}),
        'react/jsx-runtime',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-leaflet': 'ReactLeaflet',
          'leaflet': 'L',
          'milsymbol': 'milsymbol',
          'react/jsx-runtime': 'jsxRuntime',
        },
        sourcemap: true,
        banner: '/*\n * react-leaflet-milsymbol\n * A React Leaflet v4 wrapper for milsymbol\n */',
      },
    },
    sourcemap: true,
    minify: true,
  },
  optimizeDeps: {
    exclude: ['milsymbol'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});