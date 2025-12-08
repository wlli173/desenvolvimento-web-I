// Middleware global de tratamento de erros
const errorHandler = (err, req, res, next) => {

    // 🔥 Sempre mostra erro detalhado no console do backend
    console.error("===== ERRO CAPTURADO =====");
    console.error("Mensagem:", err.message);
    console.error("Tipo:", err.name);
    console.error("Código:", err.code);
    console.error("Stack trace:");
    console.error(err.stack);
    console.error("==========================");

    // Se o erro já possui um status definido, usamos ele (ex: 400, 404, 401)
    const status = err.status || err.statusCode || 500;

    // Estrutura base comum a todos os ambientes
    const respostaErro = {
        erro: "Erro interno do servidor",
        status,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        method: req.method
    };

    // Se existe mensagem
    if (err.message) respostaErro.mensagem = err.message;

    // Tipo do erro (ex: TypeError, ValidationError)
    if (err.name) respostaErro.tipo = err.name;

    // Código de erro (ex: SQLITE_CONSTRAINT)
    if (err.code) respostaErro.codigo = err.code;

    // Erros de validação (ex: Joi)
    if (err.details) {
        respostaErro.detalhes = err.details.map(d => d.message);
    }

    // Arrays de erros (ex: Sequelize, Zod, Express-validator)
    if (Array.isArray(err.errors)) {
        respostaErro.erros = err.errors.map(e => e.message || e);
    }

    // No development, continua enviando o stack pro frontend
    if (process.env.NODE_ENV === "development") {
        respostaErro.stack = err.stack;
    }

    return res.status(status).json(respostaErro);
};

module.exports = errorHandler;
