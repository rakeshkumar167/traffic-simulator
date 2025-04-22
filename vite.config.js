export default {
    root: './',
    publicDir: 'public',
    base: './',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: './index.html'
            }
        },
        assetsInlineLimit: 0,
        minify: 'terser',
        sourcemap: false,
        emptyOutDir: true,
        copyPublicDir: true
    },
    server: {
        port: 3000,
        open: true
    }
} 