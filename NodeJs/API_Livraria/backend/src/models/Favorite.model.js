class Favorite {
  constructor({
    id,
    user_id,
    livro_id,
    created_at,
    // dados do livro
    titulo,
    autor,
    descricao,
    imagem
  }) {
    this.id = id;
    this.user_id = user_id;
    this.livro_id = livro_id;
    this.created_at = created_at;

    // dados do livro favoritado
    this.titulo = titulo || null;
    this.autor = autor || null;
    this.descricao = descricao || null;
    this.imagem = imagem || null;
  }
}

module.exports = Favorite;
