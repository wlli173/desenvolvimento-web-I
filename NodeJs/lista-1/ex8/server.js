const e = require('express');
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {

    q=url.parse(req.url, true).query;
   
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('Olá, mundo!');
    }else if (req.url.startsWith('/soma')) {

        if (q.a && q.b) {
            
            const a = parseFloat(q.a);
            const b = parseFloat(q.b);
            const soma = a + b;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`A soma de ${a} e ${b} é ${soma}.`);

        }else {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.end('Por favor, forneça os parâmetros a e b na URL.');
        }

    }else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('Página não encontrada');
    }
    
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});