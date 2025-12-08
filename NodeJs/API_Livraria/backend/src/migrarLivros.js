const fs = require("fs");
const path = require("path");
const LivroRepository = require("./repositories/livros.repository"); 
const db = require("./database/sqlite");  

async function migrarLivros() {

  // Inicializar o banco de dados
  db.init();

  try {
    // 1. Carregar o JSON de livros
    const jsonPath = path.join(__dirname, "/data/livros.json"); // caminho do arquivo JSON
    const rawData = fs.readFileSync(jsonPath, "utf-8");

    let livros;
    try {
      livros = JSON.parse(rawData); // Parse do JSON
      console.log("Livros carregados:", livros);
    } catch (error) {
      console.error("Erro ao parsear o arquivo JSON:", error);
      return; // Se ocorrer um erro no parse, interrompe a execução
    }

    const repository = new LivroRepository();

    // 2. Inserir cada livro no banco usando o repository.create
    for (const livro of livros) {
      // Log para depuração: Verifica o objeto do livro
      console.log("Verificando livro:", livro);

      // Validação de campos obrigatórios
      if (!livro || !livro.titulo || !livro.autor || !livro.categoria || !livro.ano) {
        console.error("Livro inválido ou incompleto encontrado:", livro);
        continue; // Pula para o próximo livro
      }

      // Validação de numeroPaginas (se fornecido, deve ser um número)
      if (livro.numeroPaginas && isNaN(livro.numeroPaginas)) {
        console.error(`Número de páginas inválido para o livro: ${livro.titulo}`);
        continue; // Pula para o próximo livro
      }

      try {
        // Cria o novo livro no banco
        const novoLivro = await repository.create({
          titulo: livro.titulo,
          autor: livro.autor,
          categoria: livro.categoria,
          ano: parseInt(livro.ano),
          editora: livro.editora || null, // Garante que editora seja null se não houver valor
          numeroPaginas: livro.numeroPaginas ? parseInt(livro.numeroPaginas) : null // Garante que numeroPaginas seja null se não houver valor
        });

        console.log("Livro migrado:", novoLivro.titulo);
      } catch (error) {
        console.error(`Erro ao migrar o livro "${livro.titulo}":`, error.message);
      }

    }

    console.log("Migração concluída com sucesso!");
  } catch (err) {
    console.error("Erro ao migrar livros:", err.message);
  }
}

// Executa a migração
migrarLivros();
