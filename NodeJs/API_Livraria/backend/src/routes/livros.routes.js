const express = require("express");
const router = express.Router();

// Controllers
const LivrosController = require("../controllers/livros.controller");
const livrosController = new LivrosController();

// Multer (assumindo que você tenha criado src/config/multer.js exportando `upload`)
const { upload } = require("../config/multer");

// Ordem das rotas: /categoria primeiro para não conflitar com /:id
router.get("/", livrosController.listarLivros.bind(livrosController));
router.get("/categoria/:categoria", (req, res, next) => livrosController.buscarLivroPorCategoria(req, res, next));
router.get("/:id", livrosController.buscarLivroPorId.bind(livrosController));

// Para criação: aceita upload em 'cover' (file) ou campo texto 'coverUrl'
router.post("/", upload.single('cover'), livrosController.criarLivro.bind(livrosController));

// Para atualização: aceita opcionalmente upload em 'cover' (substitui) ou coverUrl
router.put("/:id", upload.single('cover'), livrosController.atualizarLivro.bind(livrosController));

router.delete("/:id", livrosController.removerLivro.bind(livrosController));

module.exports = router;
