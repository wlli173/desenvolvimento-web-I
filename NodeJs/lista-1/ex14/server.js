const http = require('http');

const contador = {'/': 0, 'sobre': 0, 'contato': 0};

const server = http.createServer((req, res) => {

    if(req.url === '/'){
        contador['/']++;
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(`Rota / foi acessada ${contador['/']} vezes.\n`);
    } else if(req.url === '/sobre'){
        contador['sobre']++;
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(`Rota /sobre foi acessada ${contador['sobre']} vezes.\n`);
    } else if(req.url === '/contato'){
        contador['contato']++;
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(`Rota /contato foi acessada ${contador['contato']} vezes.\n`);
    }

});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
