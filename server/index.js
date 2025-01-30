require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5001;
const HOST = 'localhost';

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

const server = app.listen(PORT, HOST, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`);
    console.log('Available routes:');
    console.log('- GET /');
    console.log('- GET /api/test');
    console.log('- POST /api/auth/register');
});

server.on('error', (error) => {
    console.error('Server error:', error);
    if (error.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use`);
    }
}); 