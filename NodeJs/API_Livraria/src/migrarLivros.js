const fs = require("fs");
const path = require("path");
const LivroRepository = require("./repositories/livros.repository"); // ajuste o caminho se necessário

async function migrarLivros() {
  try {
    // 1. Carregar o JSON de livros
    const jsonPath = path.join(__dirname, "/data/livros.json"); // caminho do arquivo JSON antigo
    const rawData = fs.readFileSync(jsonPath, "utf-8");
    const livros = JSON.parse(rawData);

    const repository = new LivroRepository();

    // 2. Inserir cada livro no banco usando o repository.create
    for (const livro of livros) {
      const novoLivro = await repository.create({
        titulo: livro.titulo,
        autor: livro.autor,
        categoria: livro.categoria,
        ano: parseInt(livro.ano),
        editora: livro.editora || null,
        numeroPaginas: livro.numeroPaginas ? parseInt(livro.numeroPaginas) : null,
      });

      console.log("✅ Livro migrado:", novoLivro.titulo);
    }

    console.log("🎉 Migração concluída com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao migrar livros:", err.message);
  }
}

// Executa a migração
migrarLivros();
