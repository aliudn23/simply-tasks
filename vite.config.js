import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: 'simply-task.test',
    port: 3000,
    strictPort: true,
    https: false,
  },
})
