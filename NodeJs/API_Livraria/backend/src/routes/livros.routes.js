const express = require("express");
const router = express.Router();

// Controllers
const LivrosController = require("../controllers/livros.controller");
const livrosController = new LivrosController();

// Multer
const { upload } = require("../config/multer");

// Middleware de logging para todas as rotas de livros
router.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Ordem das rotas: /categoria primeiro para não conflitar com /:id
router.get("/", livrosController.listarLivros.bind(livrosController));
router.get("/categoria/:categoria", (req, res, next) => livrosController.buscarLivroPorCategoria(req, res, next));
router.get("/:id", livrosController.buscarLivroPorId.bind(livrosController));

// Para criação: aceita upload em 'cover' (file) ou campo texto 'coverUrl'
router.post("/",
    (req, res, next) => {
        console.log('=== ANTES DO UPLOAD ===');
        console.log('Headers:', req.headers['content-type']);
        console.log('Content-Length:', req.headers['content-length']);
        console.log('Body (raw):', Object.keys(req.body));
        next();
    },
    upload.single('cover'),
    (req, res, next) => {
        console.log('=== DEPOIS DO UPLOAD ===');
        console.log('req.file:', req.file);
        console.log('req.body:', req.body);
        console.log('Arquivo salvo?', req.file ? `Sim: ${req.file.originalname} -> ${req.file.filename}` : 'Não');
        next();
    },
    livrosController.criarLivro.bind(livrosController)
);

// Para atualização: aceita opcionalmente upload em 'cover' (substitui) ou coverUrl
router.put("/:id",
    (req, res, next) => {
        console.log(`=== ANTES DO UPLOAD UPDATE ID ${req.params.id} ===`);
        console.log('Headers:', req.headers['content-type']);
        next();
    },
    upload.single('cover'),
    (req, res, next) => {
        console.log(`=== DEPOIS DO UPLOAD UPDATE ID ${req.params.id} ===`);
        console.log('req.file:', req.file);
        console.log('req.body:', req.body);
        next();
    },
    livrosController.atualizarLivro.bind(livrosController)
);

router.delete("/:id", livrosController.removerLivro.bind(livrosController));

module.exports = router;