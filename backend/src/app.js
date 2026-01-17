const express = require("express");

const app = express();

// Middleware para leer JSON
app.use(express.json()); // Linea magica (Middleware para parsear el body a JSON)

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

module.exports = app;
