const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const cors = require("cors");
const path = require('path');
const { UPLOAD_DIR } = require('../config/multer');

const app = express();

// Middlewares (ordem importa)
app.use(express.json()); // parsing JSON
app.use(express.urlencoded({ extended: true })); // parsing form data
app.use(morgan("combined")); // logs
app.use('/uploads', express.static(UPLOAD_DIR));

// --- CORS (apenas necessário se o frontend chamar o backend diretamente, sem proxy)
if (process.env.ENABLE_CORS === 'true') {
  app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    credentials: true, // permite cookies cross-origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }));
}

// Session config
app.use(session({
  name: process.env.SESSION_COOKIE_NAME || 'livraria.sid', // nome do cookie
  secret: process.env.SESSION_SECRET || 'livraria_secret_key',
  resave: false,               // evite sobrescrever sessão sem necessidade
  saveUninitialized: false,    // não salve sessões vazias
  rolling: true,               // renova a sessão a cada requisição
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true em produção (HTTPS)
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
    maxAge: 1000 * 60 * 60 * 2, // 2 horas
  },
  // Em produção, substitua o store default por um store persistente (redis/sqlite/connect-session)
  // store: new (require('connect-redis')(session))(redisClient)
}));

module.exports = app;
