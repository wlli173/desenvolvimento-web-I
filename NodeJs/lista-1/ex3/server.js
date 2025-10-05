const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {

    const q = url.parse(req.url, true).query;

    if (req.url.startsWith('/saudacao')) {

        if (q.nome) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(`Olá, ${q.nome}! Seja bem-vindo(a)!\n`);
        } else {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Olá! vistante! Seja bem-vindo(a)!\n');
        }

    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Erro: Rota não encontrada.\n');
    }
    
    
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});