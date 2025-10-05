const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {

    //Fornecer o arquivo index.html quando a raiz for acessada
    if (req.url === '/') {

        //Ler o arquivo index.html
        fs.readFile('src/index.html', (err, data) => {

            //Tratar erros de leitura do arquivo
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error\n');
            } else {
                //Enviar o conteúdo do arquivo como resposta
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }

        });

    }else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found\n');
    }

});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});