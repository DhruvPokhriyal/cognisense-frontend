import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure a single React instance is used during dev/build
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
