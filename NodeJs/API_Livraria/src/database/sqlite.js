const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_FILE = process.env.SQLITE_DB_FILE || path.join(__dirname, '../data/livraria.db');
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

let db;
function getDb() {
    if (!db) {
        db = new Database(DB_FILE);
        db.pragma('foreign_keys = ON');
    }
    return db;
}

function run(sql, params = []) { return getDb().prepare(sql).run(...params); }
function get(sql, params = []) { return getDb().prepare(sql).get(...params); }
function all(sql, params = []) { return getDb().prepare(sql).all(...params); }

function init() {
    run(`CREATE TABLE IF NOT EXISTS livros (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 titulo TEXT NOT NULL,
 autor TEXT NOT NULL,
 categoria TEXT NOT NULL,
 ano INTEGER NOT NULL,
 editora TEXT NOT NULL,
 numeroPaginas INTEGER NOT NULL
 )`);
    console.log('Banco de dados SQLite inicializado');
}

module.exports = { getDb, run, get, all, init };