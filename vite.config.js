import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3006,
  },
  resolve: {
    alias: {
      '@style': '/src/style', // Define the alias
      '@assets': '/src/assets',
      '@components': '/src/components',
      '@lib': '/src/lib'
    },
  },
})
