class Review {
  constructor({
    id,
    user_id,
    livro_id,
    conteudo,
    created_at,
    username,
    livro_titulo,
    autor
  }) {
    this.id = id;
    this.user_id = user_id;
    this.livro_id = livro_id;
    this.conteudo = conteudo;
    this.created_at = created_at;

    // dados adicionais
    this.username = username || null;
    this.livro_titulo = livro_titulo || null;
    this.autor = autor || null;
  }
}

module.exports = Review;
