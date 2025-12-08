// src/database/sqlite.js  (trecho relevante)
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

  console.log("Banco de dados SQLite inicializado");
}

module.exports = { getDb, run, get, all, init, columnExists };
