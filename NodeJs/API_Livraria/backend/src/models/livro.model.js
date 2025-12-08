// src/models/livro.model.js
class Livro {
  constructor({ id, titulo, autor, categoria, ano, editora, numeroPaginas, cover_image, created_at } = {}) {
    this.id = id;
    this.titulo = titulo;
    this.autor = autor;
    this.categoria = categoria;
    this.ano = ano;
    this.editora = editora;
    this.numeroPaginas = numeroPaginas;
    this.cover_image = cover_image; // novo
    this.created_at = created_at;

    this._validar({
      titulo,
      autor,
      categoria,
      ano,
      editora,
      numeroPaginas,
      cover_image
    });
  }

  static fromJSON(data) {
    if (!data || typeof data !== 'object') {
      const err = new Error('Livro.fromJSON: dado inválido');
      err.name = 'ValidationError';
      throw err;
    }
    return new Livro({
      id: data.id,
      titulo: data.titulo,
      autor: data.autor,
      categoria: data.categoria,
      ano: data.ano,
      editora: data.editora,
      numeroPaginas: data.numeroPaginas,
      cover_image: data.cover_image, // aceita cover_image vindo do DB
      created_at: data.created_at
    });
  }

  _validar(data = {}) {
    const errors = [];
    if (!data || typeof data !== 'object') {
      errors.push('dados do livro inválidos');
    } else {
      if (!data.titulo || String(data.titulo).trim() === '') errors.push('titulo é obrigatório');
      if (!data.autor || String(data.autor).trim() === '') errors.push('autor é obrigatório');
      if (!data.categoria || String(data.categoria).trim() === '') errors.push('categoria é obrigatório');
      if (!data.editora || String(data.editora).trim() === '') {
        // editora pode ser opcional — remova este if se quiser que seja opcional
        // errors.push('editora é obrigatória');
      }
      if (data.ano === undefined || data.ano === null || String(data.ano).trim() === '') {
        errors.push('ano é obrigatório');
      } else if (!Number.isInteger(Number(data.ano))) {
        errors.push('ano deve ser um número inteiro');
      }
      if (data.numeroPaginas === undefined || data.numeroPaginas === null || String(data.numeroPaginas).trim() === '') {
        errors.push('numeroPaginas é obrigatório');
      } else if (!Number.isInteger(Number(data.numeroPaginas)) || Number(data.numeroPaginas) <= 0) {
        errors.push('numeroPaginas deve ser um número inteiro positivo');
      }
      if (data.cover_image !== undefined && data.cover_image !== null && data.cover_image !== '') {
        if (typeof data.cover_image !== 'string') errors.push('cover_image deve ser uma string (URL ou caminho)');
        // opcional: checar formato url ou extensão de imagem
      }
    }

    if (errors.length) {
      const err = new Error('Dados inválidos: ' + errors.join('; '));
      err.name = 'ValidationError';
      err.details = errors;
      throw err;
    }
  }

  toJSON() {
    return {
      id: this.id,
      titulo: this.titulo,
      autor: this.autor,
      categoria: this.categoria,
      ano: Number(this.ano),
      editora: this.editora,
      numeroPaginas: Number(this.numeroPaginas),
      cover_image: this.cover_image || null,
      created_at: this.created_at
    };
  }
}

module.exports = Livro;
