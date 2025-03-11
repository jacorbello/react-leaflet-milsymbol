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
      include: ['src'],
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
        ...Object.keys(pkg.devDependencies || {}),
        'react/jsx-runtime',
        'leaflet',
        'react-leaflet',
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
        banner: '/*\n * react-leaflet-milsymbol\n * A React Leaflet v4 wrapper for milsymbol\n */',
      },
    },
    sourcemap: true,
    minify: 'terser',
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