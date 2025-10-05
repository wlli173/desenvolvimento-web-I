const e = require('express');
const http = require('http');

const server = http.createServer((req, res) => {

   if (req.url === '/usuario') {
        //retorna um JSON com nome e idade
        const usuario = {
            nome: 'João',
            idade: 30
        };
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(usuario));

   }else{
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Rota não encontrada');
   }
    
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});