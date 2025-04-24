import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',  // pour que le serveur soit accessible hors du container
    port: 5173,
    strictPort: true,
  },
  plugins: [react()],
})

