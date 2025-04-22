export default {
    root: './',
    publicDir: 'public',
    base: '/',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: './index.html'
            }
        }
    },
    server: {
        port: 3000,
        open: true
    }
} 