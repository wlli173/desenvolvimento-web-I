const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {

    if (req.url === '/') {

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello, World!\nAcesse /media?num1=valor1&num2=valor2&num3=valor3... para calcular a média.\n');

    } else if (req.url.startsWith('/media')) {

        const q = url.parse(req.url, true).query;
        const nums = [];

        // Coleta todos os valores numéricos da query string, independente do nome da chave
        for (let key in q){
            const num = parseFloat(q[key]);
            if (!isNaN(num)) {
                nums.push(num);
            }
        }

        if (nums.length === 0) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Nenhum número válido foi fornecido.\n');
            return;
        }

        const sum = nums.reduce((a, b) => a + b, 0);
        const media = sum / nums.length;

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Média calculada: ${media}\n`);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Rota não encontrada.\n');
    }

});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
