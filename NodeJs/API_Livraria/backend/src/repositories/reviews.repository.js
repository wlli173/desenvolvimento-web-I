const db = require("../database/sqlite");
const Review = require("../models/Review.model");

class ReviewsRepository {

  async create({ user_id, livro_id, conteudo }) {
    const res = await db.run(
      `INSERT INTO reviews (user_id, livro_id, conteudo) VALUES (?, ?, ?)`,
      [user_id, livro_id, conteudo]
    );
    return this.findById(res.lastInsertRowid);
  }

  async update(id, { conteudo }) {
    await db.run(
      `UPDATE reviews SET conteudo = ? WHERE id = ?`,
      [conteudo, id]
    );
    return this.findById(id);
  }

  async delete(id) {
    const review = await this.findById(id);
    if (!review) {
      const e = new Error("Review não encontrada");
      e.statusCode = 404;
      throw e;
    }
    await db.run(`DELETE FROM reviews WHERE id = ?`, [id]);
    return review;
  }

  async findById(id) {
    const row = await db.get(
      `SELECT r.*, u.username,
              l.titulo as livro_titulo, l.autor
       FROM reviews r
       LEFT JOIN users u ON u.id = r.user_id
       LEFT JOIN livros l ON l.id = r.livro_id
       WHERE r.id = ?`,
      [id]
    );
    return row ? new Review(row) : null;
  }

  async findAll({ page = 1, limit = 200 } = {}) {
    const offset = (page - 1) * limit;
    const rows = await db.all(
      `SELECT r.*, u.username,
              l.titulo as livro_titulo, l.autor
       FROM reviews r
       LEFT JOIN users u ON u.id = r.user_id
       LEFT JOIN livros l ON l.id = r.livro_id
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows.map(r => new Review(r));
  }

  async findByLivro(livroId, { page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    const rows = await db.all(
      `SELECT r.*, u.username,
              l.titulo as livro_titulo, l.autor
       FROM reviews r
       LEFT JOIN users u ON u.id = r.user_id
       LEFT JOIN livros l ON l.id = r.livro_id
       WHERE r.livro_id = ?
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [livroId, limit, offset]
    );
    return rows.map(r => new Review(r));
  }

  async findByUser(userId, { page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    const rows = await db.all(
      `SELECT r.*, u.username,
              l.titulo as livro_titulo, l.autor
       FROM reviews r
       LEFT JOIN users u ON u.id = r.user_id
       LEFT JOIN livros l ON l.id = r.livro_id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    return rows.map(r => new Review(r));
  }
}

module.exports = ReviewsRepository;
