const http = require('http');

const server = http.createServer((req, res) => {

    if(req.url === '/mensagem') {
        
        let msg;

        switch(req.method) {
            case 'GET':
                msg = 'Você fez uma requisição GET';
                break;
            case 'POST':
                msg = 'Você fez uma requisição POST';
                break;
            case 'PUT':
                msg = 'Você fez uma requisição PUT';
                break;
            case 'DELETE':
                msg = 'Você fez uma requisição DELETE';
                break;
            default:
                msg = 'Método não suportado';
        }

        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(msg + '\n');

    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Rota não encontrada!\n');
    }

});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
