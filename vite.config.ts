import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base './' makes the build work at any GitHub Pages path
// (username.github.io/startpage/ or a custom domain).
export default defineConfig({
  base: './',
  plugins: [react()],
})
