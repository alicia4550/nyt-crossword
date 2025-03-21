import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		proxy: {
			'/api': 'http://localhost:3000',
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
