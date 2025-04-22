import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    root: './',
    publicDir: 'public',
    plugins: [react()],
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
    },
    server: {
        port: 3000,
    },
    optimizeDeps: {
        exclude: ['p5']
    }
}); 