import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Three.js and related 3D libraries into separate chunks
          'three-core': ['three'],
          'three-fiber': ['@react-three/fiber'],
          'three-drei': ['@react-three/drei'],
          'three-postprocessing': ['@react-three/postprocessing', 'postprocessing'],
        },
      },
    },
    chunkSizeWarningLimit: 750, // Three.js core is ~718kB, can't be split further
  },
})
