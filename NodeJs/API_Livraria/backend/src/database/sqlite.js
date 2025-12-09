// src/database/sqlite.js
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const DB_FILE = process.env.SQLITE_DB_FILE || path.join(__dirname, "../data/livraria.db");
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

let db;
function getDb() {
  if (!db) {
    db = new Database(DB_FILE);
    db.pragma("foreign_keys = ON");
  }
  return db;
}

function run(sql, params = []) {
  return getDb()
    .prepare(sql)
    .run(...params);
}
function get(sql, params = []) {
  return getDb()
    .prepare(sql)
    .get(...params);
}
function all(sql, params = []) {
  return getDb()
    .prepare(sql)
    .all(...params);
}

function columnExists(table, column) {
  const rows = all(`PRAGMA table_info(${table})`);
  return rows.some(r => r.name === column);
}

function tableExists(table) {
  const row = get(`SELECT name FROM sqlite_master WHERE type='table' AND name = ?`, [table]);
  return !!row;
}

function init() {
  // Tabela livros (cria se não existir)
  run(`CREATE TABLE IF NOT EXISTS livros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    autor TEXT NOT NULL,
    categoria TEXT NOT NULL,
    ano INTEGER NOT NULL,
    editora TEXT,
    numeroPaginas INTEGER NOT NULL,
    cover_image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Caso antiga tabela não tivesse cover_image, tenta adicionar (ALTER TABLE ADD COLUMN)
  if (!columnExists('livros', 'cover_image')) {
    try {
      run(`ALTER TABLE livros ADD COLUMN cover_image TEXT`);
      console.log('Coluna cover_image adicionada em livros');
    } catch (err) {
      console.warn('Falha ao adicionar coluna cover_image (provavelmente já existe):', err.message);
    }
  }

  // Tabela de usuários: criamos apenas se não existir (assumindo que exista em outro lugar)
  // Se você já tem users, isso não cria / altera. Mantive a checagem por segurança.
  if (!tableExists('users')) {
    run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log('Tabela users criada (por segurança).');
  }

  // NOVA TABELA: favoritos (cada usuário pode favoritar livros; par único)
  run(`CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    livro_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(livro_id) REFERENCES livros(id) ON DELETE CASCADE
  )`);

  // Garante unicidade do par user_id + livro_id para evitar duplicados
  try {
    run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_favorites_user_livro ON favorites(user_id, livro_id)`);
  } catch (err) {
    console.warn('Falha ao criar índice de favoritos:', err.message);
  }

  // NOVA TABELA: reviews (comentários/avaliações de usuários sobre livros)
  run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    livro_id INTEGER NOT NULL,
    conteudo TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(livro_id) REFERENCES livros(id) ON DELETE CASCADE
  )`);

  // Índice para acelerar buscas por livro
  try {
    run(`CREATE INDEX IF NOT EXISTS idx_reviews_livro ON reviews(livro_id)`);
    run(`CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id)`);
  } catch (err) {
    console.warn('Falha ao criar índices de reviews:', err.message);
  }

  console.log("Banco de dados SQLite inicializado (tabelas: livros, users, favorites, reviews)");
}

module.exports = { getDb, run, get, all, init, columnExists, tableExists };
