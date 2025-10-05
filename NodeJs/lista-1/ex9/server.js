const e = require('express');
const http = require('http');

const server = http.createServer((req, res) => {

    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('Olá, mundo!');
    }else if (req.url === '/frutas') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const frutas = ['maçã', 'banana', 'laranja', 'uva', 'pera'];
        res.end(JSON.stringify(frutas));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('Página não encontrada');
    }
    
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});