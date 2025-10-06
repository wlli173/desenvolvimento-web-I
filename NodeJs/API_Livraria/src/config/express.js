const express = require("express");
const morgan = require("morgan");

const app = express();

//Middlewares 
app.use(express.json()); // Middleware para interpretar JSON
app.use(express.urlencoded({ extended: true })); // Suporte para dados de formulários
app.use(morgan("combined")); // Logging HTTP

module.exports = app;