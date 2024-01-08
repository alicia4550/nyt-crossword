import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
          "/nytsyn-crossword-mh": {
            target: "https://nytsyn.pzzl.com",
            changeOrigin: true,
            secure: false,      
            ws: true
          },
        },
      },
    plugins: [react()], 
    test: {
        coverage: {
            reportsDirectory: './tests/coverage',
            include: [
                'src'
            ]
        },
        globals: true,
        setupFiles: './tests/setup.js',
        environment: "jsdom"
    }
})
