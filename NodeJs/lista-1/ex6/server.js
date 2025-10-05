const e = require('express');
const http = require('http');
let visitas = 0;

const server = http.createServer((req, res) => {
   
   visitas++;
    if (req.url === '/') {
        //retorna uma mensagem de boas vindas
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Bem vindo ao servidor!');
    } else if (req.url === '/visitas') {
        //retorna o número de visitas
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(`Número de visitas: ${visitas}`);
    }else{
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Rota não encontrada');
   }

    
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});