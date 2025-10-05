const http = require('http');

const server = http.createServer((req, res) => {

    if (req.url === '/horario') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        res.end(`Hora atual: ${hours}:${minutes}:${seconds}\n`);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found\n');
    }
    
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});