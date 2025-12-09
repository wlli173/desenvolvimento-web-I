const bcrypt = require("bcrypt");
const UsersRepository = require("../repositories/user.repository");

class AuthController {
  constructor() {
    this.usersRepo = new UsersRepository();
  }

  async register(req, res, next) {
    try {
      console.log('register req.body =', req.body);
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
      }

      const existingUser = await this.usersRepo.findByEmail(username);
      if (existingUser) {
        return res.status(409).json({ erro: "Usuário já existe." });
      }

      const existingEmail = await this.usersRepo.findByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ erro: "Email já cadastrado." });
      }

      const hash = await bcrypt.hash(password, 10);

      // Wrap create in try so we can log errors specifically
      let user;
      try {
        user = await this.usersRepo.create({ username, email, passwordHash: hash });
        console.log('UsersRepository.create returned:', user);
      } catch (createErr) {
        console.error('Erro ao criar usuário (caught in controller):', createErr && createErr.stack ? createErr.stack : createErr);
        // Constraint error -> 409 (user/email duplicate)
        if (createErr && createErr.code && createErr.code.toString().includes('SQLITE_CONSTRAINT')) {
          return res.status(409).json({ erro: "Nome de usuário ou email já cadastrado." });
        }
        // repassa para o errorHandler
        throw createErr;
      }

      if (!user || !user.id) {
        throw new Error("Falha ao criar usuário (user null ou sem id).");
      }

      req.session.userId = user.id;
      console.log('session after register =', req.session);

      const publicUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at
      };

      return res.status(201).json({
        mensagem: "Usuário registrado com sucesso!",
        user: publicUser
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await this.usersRepo.findByEmail(email);
      console.log('login - user from repo =', user);

      if (!user) return res.status(401).json({ erro: "Usuário ou senha inválidos." });

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.status(401).json({ erro: "Usuário ou senha inválidos." });

      req.session.userId = user.id;
      const publicUser = { id: user.id, username: user.username, email: user.email, created_at: user.created_at };
      res.status(200).json({ mensagem: "Login realizado com sucesso!", user: publicUser });
    } catch (err) {
      next(err);
    }
  }

  async me(req, res, next) {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ erro: "Não autenticado." });
      }
      const user = await this.usersRepo.findById(req.session.userId);
      if (!user) return res.status(404).json({ erro: "Usuário não encontrado." });
      const publicUser = { id: user.id, username: user.username, email: user.email, created_at: user.created_at };
      res.status(200).json({ user: publicUser });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    req.session.destroy(() => {
      res.status(200).json({ mensagem: "Logout realizado com sucesso." });
    });
  }
}

module.exports = AuthController;