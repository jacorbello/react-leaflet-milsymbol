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
      // Make sure to externalize deps that shouldn't be bundled
      external: [
        ...Object.keys(pkg.devDependencies || {}),
        'react/jsx-runtime',
        'leaflet',
        'react-leaflet',
      ],
      output: {
        // Provide global variables to use in the UMD build
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-leaflet': 'ReactLeaflet',
          'leaflet': 'L',
          'milsymbol': 'milsymbol',
        },
        // Add banner comment at the top of generated files
        banner: '/*\n * react-leaflet-milsymbol\n * A React Leaflet v4 wrapper for milsymbol\n */',
      },
    },
    // Generate sourcemaps for easier debugging
    sourcemap: true,
    // Minify the output
    minify: 'terser',
  },
  // Avoid Vite's default HTML handling to focus on library output
  optimizeDeps: {
    exclude: ['milsymbol'],
  },
  // Add resolve aliases for cleaner imports in your code
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});