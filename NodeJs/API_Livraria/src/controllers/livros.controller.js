const LivrosRepository = require("../repositories/livros.repository");

class LivrosController {
  constructor() {
    this.repository = new LivrosRepository();
  }

  async listarLivros(req, res, next) {
    const livros = await this.repository.findAll();
    res.status(200).json(livros);
  }

  async buscarLivroPorId(req, res, next) {
    const id = parseInt(req.params.id);
    const livro = await this.repository.findById(id);
    if (!livro) {
      return res.status(404).json({ erro: "Livro não encontrado" });
    }
    res.status(200).json(livro);
  }

  async buscarLivroPorCategoria(req, res, next) {
  try {
    const categoria = req.params.categoria;
    const livros = await this.repository.findByCategoria(categoria);

    if (!livros || livros.length === 0) {
      return res.status(404).json({ erro: "Nenhum livro encontrado nesta categoria" });
    }

    res.status(200).json(livros);
  } catch (error) {
    next(error); // deixa o middleware de erro tratar
  }
}


  async criarLivro(req, res, next) {
    const { titulo, autor, categoria, ano } = req.body;
    const novoLivro = await this.repository.create({
      titulo,
      autor,
      categoria,
      ano: parseInt(ano),
    });
    res.status(201).json({
      mensagem: "Livro criado com sucesso",
      data: novoLivro,
    });
  }

  async atualizarLivro(req, res, next) {
    const id = parseInt(req.params.id);
    const dados = req.body;
    const livroAtualizado = await this.repository.update(id, dados);
    res.status(200).json({
      mensagem: "Livro atualizado com sucesso",
      data: livroAtualizado,
    });
  }

  async removerLivro(req, res, next) {
    const id = parseInt(req.params.id);
    const livroRemovido = await this.repository.delete(id);
    res.status(200).json({
      mensagem: "Livro removido com sucesso",
      data: livroRemovido,
    });
  }
}

module.exports = LivrosController;
