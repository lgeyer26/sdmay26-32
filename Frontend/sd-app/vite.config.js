import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),

    // Tells Vite to parse .geojson files as JSON objects,
    // the same way it natively handles .json imports.
    {
      name: 'geojson-loader',
      transform(src, id) {
        if (id.endsWith('.geojson')) {
          return {
            code: `export default ${src}`,
            map: null,
          }
        }
      },
    },
  ],
})