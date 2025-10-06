const express = require('express');
const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Array em memória para armazenar os usuários
let usuarios = [];

// GET /usuarios → retorna a lista de usuários
app.get('/usuarios', (req, res) => {
  res.json(usuarios);
});

// POST /usuarios → adiciona um usuário
app.post('/usuarios', (req, res) => {
  const { nome, idade } = req.body;

  if (!nome || !idade) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Nome e idade são obrigatórios"
    });
  }

  const novoUsuario = { nome, idade };
  usuarios.push(novoUsuario);

  res.json({
    sucesso: true,
    mensagem: "Usuário adicionado com sucesso",
    usuario: novoUsuario
  });
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
