export default () => ({
    app: {
        environment:
            process.env.NODE_ENV === 'production'
                ? 'production'
                : process.env.APP_ENV,
        port: parseInt(process.env.APP_PORT, 10) || 3000,
        host: 'localhost',
        name: process.env.APP_NAME || 'CLICKER',
    },

   
})