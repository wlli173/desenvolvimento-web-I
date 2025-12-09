// src/routes/favorites.routes.js
const express = require("express");
const router = express.Router();

const FavoritesController = require("../controllers/favorites.controller");
const favoritesController = new FavoritesController();

const { requireAuth } = require("../middlewares/auth");

// Adicionar favorito
router.post("/:livroId", requireAuth, (req, res, next) => favoritesController.addFavorite(req, res, next));

// Remover favorito
router.delete("/:livroId", requireAuth, (req, res, next) => favoritesController.removeFavorite(req, res, next));

// Listar favoritos do usuário
router.get("/", requireAuth, (req, res, next) => favoritesController.listUserFavorites(req, res, next));

module.exports = router;
