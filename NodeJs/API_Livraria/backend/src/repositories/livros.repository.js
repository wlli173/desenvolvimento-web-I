const Livro = require("../models/livro.model");
const db = require("../database/sqlite");

class LivrosRepository {

  async findAll() {
    console.log("Executando query no banco...");
    const rows = await db.all("SELECT * FROM livros ORDER BY id ASC");
    console.log("Resultados encontrados:", rows.length);
    console.log("Dados:", rows);
    // Retorna plain objects (toJSON) para evitar problemas ao serializar instâncias
    return rows.map(r => Livro.fromJSON(r).toJSON());
  }

  async findById(id) {
    const row = await db.get("SELECT * FROM livros WHERE id = ?", [id]);
    return row ? Livro.fromJSON(row).toJSON() : null;
  }

  async findByCategoria(categoria) {
    const rows = await db.all("SELECT * FROM livros WHERE categoria = ? ORDER BY id ASC", [categoria]);
    return rows.map(r => Livro.fromJSON(r).toJSON());
  }

  async create(data) {
    // cria instância para validação via modelo
    const novo = new Livro({ id: null, ...data });

    const res = await db.run(
      "INSERT INTO livros (titulo, autor, categoria, ano, editora, numeroPaginas, cover_image) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        novo.titulo,
        novo.autor,
        novo.categoria,
        novo.ano,
        novo.editora || null,
        novo.numeroPaginas || null,
        novo.cover_image || null
      ]
    );

    return this.findById(res.lastInsertRowid);
  }

  async update(id, dados) {
    // cria instância (validação) - assumimos dados já mesclados pelo controller
    const atual = new Livro({ id, ...dados });

    await db.run(
      "UPDATE livros SET titulo = ?, autor = ?, categoria = ?, ano = ?, editora = ?, numeroPaginas = ?, cover_image = ? WHERE id = ?",
      [
        atual.titulo,
        atual.autor,
        atual.categoria,
        atual.ano,
        atual.editora || null,
        atual.numeroPaginas || null,
        atual.cover_image || null,
        id
      ]
    );

    return this.findById(id);
  }

  async delete(id) {
    const existente = await this.findById(id);
    if (!existente) {
      const e = new Error("Livro não encontrado");
      e.statusCode = 404; throw e;
    }
    await db.run("DELETE FROM livros WHERE id = ?", [id]);
    return existente;
  }

}

module.exports = LivrosRepository;
