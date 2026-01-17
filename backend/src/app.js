const express = require("express");

const app = express();

// Middleware para leer JSON
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

module.exports = app;
