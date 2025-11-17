const express = require("express");
const router = express.Router();

// Controllers
const LivrosController = require("../controllers/livros.controller");
const livrosController = new LivrosController();


router.get("/", livrosController.listarLivros.bind(livrosController));
router.get("/categoria/:categoria", (req, res, next) => livrosController.buscarLivroPorCategoria(req, res, next));
router.get("/:id", livrosController.buscarLivroPorId.bind(livrosController));
router.post("/", livrosController.criarLivro.bind(livrosController));
router.put("/:id", livrosController.atualizarLivro.bind(livrosController));
router.delete("/:id", livrosController.removerLivro.bind(livrosController));

module.exports = router;