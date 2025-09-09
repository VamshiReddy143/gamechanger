import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    darkMode: "class", 
  define: {
    global: 'window', // Fix simple-peer "global is not defined"
  },
  plugins: [
    tailwindcss(),
    react()
  ],
})
