// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

const app = require("./src/app");

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () =>{
    console.log('Servidor rodando na porta ${PORT} (${NODE_ENV})');
});