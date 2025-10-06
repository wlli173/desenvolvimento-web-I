const express = require('express');
const app = express();

// Middleware para interpretar JSON no corpo da requisição
app.use(express.json());

app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  if (usuario === "admin" && senha === "1234") {
    return res.json({
      sucesso: true,
      mensagem: "Login bem-sucedido"
    });
  } else {
    return res.json({
      sucesso: false,
      mensagem: "Usuário ou senha inválidos"
    });
  }
});


app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
