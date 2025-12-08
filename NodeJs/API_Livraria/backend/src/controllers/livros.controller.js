const LivrosRepository = require("../repositories/livros.repository");

class LivrosController {
  constructor() {
    this.repository = new LivrosRepository();
  }

  // GET /api/livros
  async listarLivros(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      const livros = await this.repository.findAll();

      const total = livros.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const end = start + limit;

      const resultados = livros.slice(start, end);

      res.status(200).json({
        page,
        limit,
        total,
        totalPages,
        data: resultados
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/livros/:id
  async buscarLivroPorId(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

      const livro = await this.repository.findById(id);
      if (!livro) {
        return res.status(404).json({ erro: "Livro não encontrado" });
      }
      res.status(200).json(livro);
    } catch (err) {
      next(err);
    }
  }

  // GET /api/livros/categoria/:categoria
  async buscarLivroPorCategoria(req, res, next) {
    try {
      const categoria = req.params.categoria;
      const livros = await this.repository.findByCategoria(categoria);

      if (!livros || livros.length === 0) {
        return res.status(404).json({ erro: "Nenhum livro encontrado nesta categoria" });
      }

      res.status(200).json(livros);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/livros
  async criarLivro(req, res, next) {
    try {
      console.log('criarLivro - req.body =', req.body);

      // Coerção / sanitização mínima
      const payload = {
        titulo: req.body.titulo,
        autor: req.body.autor,
        categoria: req.body.categoria,
        ano: req.body.ano !== undefined ? Number(req.body.ano) : undefined,
        editora: req.body.editora,
        numeroPaginas: req.body.numeroPaginas !== undefined ? Number(req.body.numeroPaginas) : undefined,
        cover_image: undefined
      };

      // Se veio arquivo, monta caminho público (assumindo app serve /uploads)
      if (req.file) {
        payload.cover_image = `/uploads/${req.file.filename}`;
      } else if (req.body.coverUrl) {
        payload.cover_image = req.body.coverUrl;
      }

      // validação rápida antes de enviar ao repo (evita erros óbvios)
      const missing = [];
      ['titulo','autor','categoria','ano','numeroPaginas'].forEach(f => {
        if (payload[f] === undefined || payload[f] === null || String(payload[f]).trim() === '') missing.push(f);
      });
      if (missing.length) {
        return res.status(400).json({ erro: 'Campos obrigatórios ausentes: ' + missing.join(', ') });
      }
      if (!Number.isInteger(payload.ano) || !Number.isInteger(payload.numeroPaginas) || payload.numeroPaginas <= 0) {
        return res.status(400).json({ erro: 'Ano e numeroPaginas devem ser inteiros válidos (numeroPaginas > 0).' });
      }

      const novo = await this.repository.create(payload);
      return res.status(201).json(novo);
    } catch (err) {
      console.error('criarLivro - erro:', err && err.stack ? err.stack : err);
      if (err.name === 'ValidationError') {
        return res.status(400).json({ erro: err.message, detalhes: err.details });
      }
      next(err);
    }
  }

  // PUT /api/livros/:id
  async atualizarLivro(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

      console.log('atualizarLivro - id, body =', id, req.body);

      // busca existente para mesclar (preservar cover_image se não for enviado)
      const existing = await this.repository.findById(id);
      if (!existing) return res.status(404).json({ erro: "Livro não encontrado" });

      const payload = {
        titulo: req.body.titulo ?? existing.titulo,
        autor: req.body.autor ?? existing.autor,
        categoria: req.body.categoria ?? existing.categoria,
        ano: req.body.ano !== undefined ? Number(req.body.ano) : existing.ano,
        editora: req.body.editora ?? existing.editora,
        numeroPaginas: req.body.numeroPaginas !== undefined ? Number(req.body.numeroPaginas) : existing.numeroPaginas,
        cover_image: existing.cover_image
      };

      // se veio novo arquivo, atualiza; se veio coverUrl, usa; senão preserva existing.cover_image
      if (req.file) {
        payload.cover_image = `/uploads/${req.file.filename}`;
      } else if (req.body.coverUrl) {
        payload.cover_image = req.body.coverUrl;
      }

      // validação mínima (mesma do criar)
      const missing = [];
      ['titulo','autor','categoria','ano','numeroPaginas'].forEach(f => {
        if (payload[f] === undefined || payload[f] === null || String(payload[f]).trim() === '') missing.push(f);
      });
      if (missing.length) {
        return res.status(400).json({ erro: 'Campos obrigatórios ausentes: ' + missing.join(', ') });
      }
      if (!Number.isInteger(payload.ano) || !Number.isInteger(payload.numeroPaginas) || payload.numeroPaginas <= 0) {
        return res.status(400).json({ erro: 'Ano e numeroPaginas devem ser inteiros válidos (numeroPaginas > 0).' });
      }

      const atualizado = await this.repository.update(id, payload);
      return res.status(200).json(atualizado);
    } catch (err) {
      console.error('atualizarLivro - erro:', err && err.stack ? err.stack : err);
      if (err.name === 'ValidationError') {
        return res.status(400).json({ erro: err.message, detalhes: err.details });
      }
      next(err);
    }
  }

  // DELETE /api/livros/:id
  async removerLivro(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) return res.status(400).json({ erro: "ID inválido" });

      const livroRemovido = await this.repository.delete(id);
      return res.status(200).json({
        mensagem: "Livro removido com sucesso",
        data: livroRemovido,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = LivrosController;
