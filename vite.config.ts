import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Add this if you encounter any issues with the bikram-sambat module
    dedupe: ['bikram-sambat']
  },
  server: {
    host: true,
  }
})
