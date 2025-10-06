const express = require("express");
const app = express();
app.use(express.json());

let produtos = [
  { id: 1, nome: "Teclado", preco: 120 }
];

// GET → Lista todos os produtos
app.get("/produtos", (req, res) => {
  res.json(produtos);
});

// POST → Adiciona um novo produto
app.post("/produtos", (req, res) => {
  const novoProduto = req.body;
  produtos.push(novoProduto);
  res.status(201).json({ mensagem: "Produto adicionado!", produto: novoProduto });
});

// PUT → Atualiza um produto pelo ID
app.put("/produtos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const dadosAtualizados = req.body;

  const index = produtos.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ erro: "Produto não encontrado!" });

  produtos[index] = { ...produtos[index], ...dadosAtualizados };
  res.json({ mensagem: "Produto atualizado!", produto: produtos[index] });
});

// DELETE → Remove um produto pelo ID
app.delete("/produtos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = produtos.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ erro: "Produto não encontrado!" });

  const removido = produtos.splice(index, 1);
  res.json({ mensagem: "Produto removido!", removido });
});

// Inicia o servidor
app.listen(3000, () => {
  console.log("API rodando em http://localhost:3000");
});
