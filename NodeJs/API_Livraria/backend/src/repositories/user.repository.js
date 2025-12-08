// repositories/user.repository.js
const db = require("../database/sqlite");

class UsersRepository {
  async findById(id) {
    const row = await db.get(
      "SELECT id, username, email, created_at FROM users WHERE id = ?",
      [id]
    );
    return row || null;
  }

  async findByEmail(username) {
    const row = await db.get(
      "SELECT id, username, email, password_hash, created_at FROM users WHERE email = ?",
      [username]
    );
    return row || null;
  }

  async findByEmail(email) {
    const row = await db.get(
      "SELECT id, username, email, password_hash, created_at FROM users WHERE email = ?",
      [email]
    );
    return row || null;
  }

  async create({ username, email, passwordHash }) {
    // Tentaremos suportar tanto better-sqlite3 (síncrono) quanto wrappers (assíncronos)
    try {
      console.log('UsersRepository.create - input:', { username, email });

      // Se o objeto db tiver .prepare (better-sqlite3), use o run síncrono
      if (typeof db.prepare === 'function') {
        const stmt = db.prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
        const result = stmt.run(username, email, passwordHash);
        // better-sqlite3: result.lastInsertRowid
        const id = result && (result.lastInsertRowid || result.lastID || result.last_insert_rowid);
        console.log('UsersRepository.create (better-sqlite3) - result:', result, 'id:', id);

        if (!id) {
          throw new Error('UsersRepository.create: não conseguiu recuperar id do insert (better-sqlite3).');
        }

        const row = await db.get("SELECT id, username, email, created_at FROM users WHERE id = ?", [id]);
        return row || null;
      }

      // Caso db.run seja async (promisified wrapper)
      if (typeof db.run === 'function') {
        const result = await db.run(
          "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
          [username, email, passwordHash]
        );
        console.log('UsersRepository.create (async run) - raw result:', result);

        const id = result && (result.lastInsertRowid || result.lastID || result.last_insert_rowid);
        console.log('UsersRepository.create - resolved id:', id);

        if (!id) {
          // fallback: select by unique fields
          const fallback = await db.get(
            "SELECT id, username, email, created_at FROM users WHERE username = ? OR email = ? ORDER BY created_at DESC LIMIT 1",
            [username, email]
          );
          return fallback || null;
        }
        const row = await db.get("SELECT id, username, email, created_at FROM users WHERE id = ?", [id]);
        return row || null;
      }

      throw new Error('UsersRepository.create: driver SQLite inesperado. Nem prepare nem run disponíveis.');
    } catch (err) {
      console.error('UsersRepository.create - erro:', err && err.stack ? err.stack : err);
      throw err;
    }
  }
}

module.exports = UsersRepository;
