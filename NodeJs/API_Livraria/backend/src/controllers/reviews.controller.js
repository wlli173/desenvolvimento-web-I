// src/controllers/reviews.controller.js
const ReviewsRepository = require("../repositories/reviews.repository");
const LivrosRepository = require("../repositories/livros.repository");

class ReviewsController {
  constructor() {
    this.repo = new ReviewsRepository();
    this.livrosRepo = new LivrosRepository();
  }

  // POST /api/reviews
  async createReview(req, res, next) {
    try {
      const userId = req.session.userId;
      if (!userId) return res.status(401).json({ erro: "Não autenticado" });

      const { livro_id, conteudo } = req.body;
      const livroId = Number(livro_id);
      if (!Number.isInteger(livroId)) return res.status(400).json({ erro: "ID de livro inválido" });
      if (!conteudo || String(conteudo).trim() === '') return res.status(400).json({ erro: "Conteúdo é obrigatório" });

      const livro = await this.livrosRepo.findById(livroId);
      if (!livro) return res.status(404).json({ erro: "Livro não encontrado" });

      const novo = await this.repo.create({ user_id: userId, livro_id: livroId, conteudo: String(conteudo).trim() });
      return res.status(201).json(novo);
    } catch (err) {
      next(err);
    }
  }

  async listAllReviews(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 200;
      const offset = (page - 1) * limit;

      // Buscar todas as reviews com paginação
      const rows = await this.repo.findAll({ page, limit, offset });

      return res.status(200).json({
        page,
        limit,
        data: rows,
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/reviews?livro_id=...
  async listReviews(req, res, next) {
    try {
      const livroId = req.query.livro_id ? Number(req.query.livro_id) : null;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 20;

      if (livroId) {
        if (!Number.isInteger(livroId)) return res.status(400).json({ erro: "ID de livro inválido" });
        const rows = await this.repo.findByLivro(livroId, { page, limit });
        return res.status(200).json({ page, limit, data: rows });
      } else {
        // lista todas as reviews (poderia ser perigoso em grandes bases) — aqui devolvemos vazias ou instruímos a passar livro_id
        return res.status(400).json({ erro: "Passe livro_id como query para listar reviews de um livro" });
      }
    } catch (err) {
      next(err);
    }
  }

  // GET /api/reviews/:id
  async getReview(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) return res.status(400).json({ erro: "ID inválido" });
      const review = await this.repo.findById(id);
      if (!review) return res.status(404).json({ erro: "Review não encontrada" });
      return res.status(200).json(review);
    } catch (err) {
      next(err);
    }
  }

  // PUT /api/reviews/:id  (só autor)
  async updateReview(req, res, next) {
    try {
      const userId = req.session.userId;
      if (!userId) return res.status(401).json({ erro: "Não autenticado" });

      const id = Number(req.params.id);
      if (!Number.isInteger(id)) return res.status(400).json({ erro: "ID inválido" });

      const existing = await this.repo.findById(id);
      if (!existing) return res.status(404).json({ erro: "Review não encontrada" });
      if (existing.user_id !== userId) return res.status(403).json({ erro: "Sem permissão para modificar esta review" });

      const { conteudo } = req.body;
      if (!conteudo || String(conteudo).trim() === '') return res.status(400).json({ erro: "Conteúdo é obrigatório" });

      const updated = await this.repo.update(id, { conteudo: String(conteudo).trim() });
      return res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  }

  // DELETE /api/reviews/:id  (autor ou admin)
  async deleteReview(req, res, next) {
    try {
      const userId = req.session.userId;
      if (!userId) return res.status(401).json({ erro: "Não autenticado" });

      const id = Number(req.params.id);
      if (!Number.isInteger(id)) return res.status(400).json({ erro: "ID inválido" });

      const existing = await this.repo.findById(id);
      if (!existing) return res.status(404).json({ erro: "Review não encontrada" });

      // autorização simples: só autor pode excluir (expanda se tiver roles)
      if (existing.user_id !== userId) return res.status(403).json({ erro: "Sem permissão para remover esta review" });

      const removed = await this.repo.delete(id);
      return res.status(200).json({ mensagem: "Review removida", data: removed });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ReviewsController;
