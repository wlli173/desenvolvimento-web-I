// src/routes/reviews.routes.js
const express = require("express");
const router = express.Router();

const ReviewsController = require("../controllers/reviews.controller");
const reviewsController = new ReviewsController();

const { requireAuth } = require("../middlewares/auth");

// Criar review (autenticado)
router.post("/", requireAuth, (req, res, next) => reviewsController.createReview(req, res, next));

// Listar reviews por livro (query ?livro_id=)
router.get("/", (req, res, next) => reviewsController.listReviews(req, res, next));

// **Nova rota: listar todas as reviews**
router.get("/all", (req, res, next) => reviewsController.listAllReviews(req, res, next));

// Obter uma review
router.get("/:id", (req, res, next) => reviewsController.getReview(req, res, next));

// Atualizar (somente autor)
router.put("/:id", requireAuth, (req, res, next) => reviewsController.updateReview(req, res, next));

// Remover (somente autor)
router.delete("/:id", requireAuth, (req, res, next) => reviewsController.deleteReview(req, res, next));

module.exports = router;
