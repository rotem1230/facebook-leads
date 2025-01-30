const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    console.log('Setting up proxy middleware...');
    
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:5001',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/api'
            },
            onProxyReq: (proxyReq, req) => {
                if (req.body) {
                    const bodyData = JSON.stringify(req.body);
                    proxyReq.setHeader('Content-Type', 'application/json');
                    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                    proxyReq.write(bodyData);
                }
            },
            onProxyRes: (proxyRes, req, res) => {
                console.log(`[${req.method}] ${req.path} => ${proxyRes.statusCode}`);
            },
            onError: (err, req, res) => {
                console.error('Proxy Error:', err);
                res.writeHead(500, {
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({ 
                    message: 'Proxy Error', 
                    error: err.message 
                }));
            }
        })
    );
    console.log('Proxy middleware setup complete');
}; 