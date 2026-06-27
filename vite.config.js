import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        open: true,
        host: '0.0.0.0',
        allowedHosts: [
            'localhost',
            'xn-2a35-s8.local',
            'xn-2a35-s8.network.teslasoft.org',
            'queens.andrax.dev'
        ]
    }
})
