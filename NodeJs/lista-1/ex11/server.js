const e = require('express');
const http = require('http');

const server = http.createServer((req, res) => {

    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('Olá, mundo!');
    }else if (req.url === '/node') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Minha Pagina Node.js</h1><p>Esta é uma página de teste</p>');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('Página não encontrada');
    }
   
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});