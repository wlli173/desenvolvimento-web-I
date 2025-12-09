const app = require("./config/express")
const db = require("./database/sqlite");
const path = require('path'); // Adicione esta linha
const express = require('express');

db.init(); // garante que a tabela exista antes das rotas

// Servir arquivos estáticos da pasta public/uploads
// ADICIONE ESTA LINHA ANTES DAS ROTAS:
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Todas as rotas da aplicação (centralizadas)
const routes = require("./routes");
const authRoutes = require("./routes/auth.routes");
const favoritesRoutes = require("./routes/favorites.routes");
const reviewsRoutes = require("./routes/reviews.routes");

// Configura o middleware de tratamento de erros
const errorHandler = require("./middlewares/errorHandler");

// Configura as rotas com prefixo /api
app.use("/api", routes);
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/reviews", reviewsRoutes);

// Middleware de tratamento de erros
app.use(errorHandler);

// Handler para rotas não encontradas (404)
app.use((req, res) => {
    res.status(404).json({ erro: "Endpoint não encontrado" });
});

module.exports = app;