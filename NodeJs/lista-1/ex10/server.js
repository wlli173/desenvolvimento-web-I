const e = require('express');
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {

    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('Olá, mundo!');
    }else if (req.url === '/metodo') {

        let metodo = req.method;

        res.writeHead(200, { 'Content-Type': 'Json' });
        res.end(JSON.stringify({ metodo: metodo }));

    }else{
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('Página não encontrada');
    }
    
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});