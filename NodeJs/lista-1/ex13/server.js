const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {

    if (req.url === '/') {

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello, World!\n Acesse /media?num1=valor1&num2=valor2 para calcular a média.\n');

    } else if (req.url.startsWith('/media')) {

        const q = url.parse(req.url, true).query;
        const nums = [];

        // Pega os números da query string
        for (let key in q){
            const num = parseFloat(q[key]);
            if (!isNaN(num)) {
                nums.push(num);
            }
        }

        let media = 0;

        // Calcula a média
        if (nums.length > 0) {
            const sum = nums.reduce((a, b) => a + b, 0);
            media = sum / nums.length;
        }else {
            // Se não houver números válidos, retorna um erro
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('No valid numbers provided.\n');
            return;
        }

    }

});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});