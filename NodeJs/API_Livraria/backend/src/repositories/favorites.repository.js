const db = require("../database/sqlite");
const Favorite = require("../models/Favorite.model");

class FavoritesRepository {
  async create(userId, livroId) {
    const res = await db.run(
      `INSERT INTO favorites (user_id, livro_id) VALUES (?, ?)`,
      [userId, livroId]
    );
    return res.lastInsertRowid;
  }

  async remove(userId, livroId) {
    const res = await db.run(
      `DELETE FROM favorites WHERE user_id = ? AND livro_id = ?`,
      [userId, livroId]
    );
    return res.changes; // 1 se removido
  }

  async exists(userId, livroId) {
    const row = await db.get(
      `SELECT id FROM favorites WHERE user_id = ? AND livro_id = ?`,
      [userId, livroId]
    );
    return !!row;
  }

  async findByUser(userId, { page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    const rows = await db.all(
      `SELECT f.id, f.user_id, f.livro_id, f.created_at,
            l.titulo, l.autor, l.cover_image as imagem
          FROM favorites f
          JOIN livros l ON l.id = f.livro_id
          WHERE f.user_id = ?
          ORDER BY f.created_at DESC
          LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    return rows.map(r => new Favorite(r));
  }

  async countByLivro(livroId) {
    const row = await db.get(
      `SELECT COUNT(*) as count FROM favorites WHERE livro_id = ?`,
      [livroId]
    );
    return row ? row.count : 0;
  }
}

module.exports = FavoritesRepository;