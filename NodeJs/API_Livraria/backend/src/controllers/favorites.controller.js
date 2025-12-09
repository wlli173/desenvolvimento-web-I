// src/controllers/favorites.controller.js
const FavoritesRepository = require("../repositories/favorites.repository");
const LivrosRepository = require("../repositories/livros.repository");

class FavoritesController {
  constructor() {
    this.repo = new FavoritesRepository();
    this.livrosRepo = new LivrosRepository();
  }

  // POST /api/favorites/:livroId
  async addFavorite(req, res, next) {
    try {
      const userId = req.session.userId;
      const livroId = Number(req.params.livroId);
      if (!userId) return res.status(401).json({ erro: "Não autenticado" });
      if (!Number.isInteger(livroId)) return res.status(400).json({ erro: "ID de livro inválido" });

      const livro = await this.livrosRepo.findById(livroId);
      if (!livro) return res.status(404).json({ erro: "Livro não encontrado" });

      const exists = await this.repo.exists(userId, livroId);
      if (exists) return res.status(409).json({ erro: "Livro já favoritado" });

      await this.repo.create(userId, livroId);
      const count = await this.repo.countByLivro(livroId);
      return res.status(201).json({ mensagem: "Favorito adicionado", totalFavorites: count });
    } catch (err) {
      next(err);
    }
  }

  // DELETE /api/favorites/:livroId
  async removeFavorite(req, res, next) {
    try {
      const userId = req.session.userId;
      const livroId = Number(req.params.livroId);
      if (!userId) return res.status(401).json({ erro: "Não autenticado" });
      if (!Number.isInteger(livroId)) return res.status(400).json({ erro: "ID de livro inválido" });

      const removed = await this.repo.remove(userId, livroId);
      if (!removed) return res.status(404).json({ erro: "Favorito não encontrado" });

      const count = await this.repo.countByLivro(livroId);
      return res.status(200).json({ mensagem: "Favorito removido", totalFavorites: count });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/favorites  (lista favoritos do usuário)
  async listUserFavorites(req, res, next) {
    try {
      const userId = req.session.userId;
      if (!userId) return res.status(401).json({ erro: "Não autenticado" });

      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 20;

      const rows = await this.repo.findByUser(userId, { page, limit });
      return res.status(200).json({ page, limit, data: rows });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = FavoritesController;
