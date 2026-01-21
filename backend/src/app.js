import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import libroRoutes from "./routes/libroRoutes.js";

const app = express();

// Middleware para leer JSON
app.use(express.json()); // Linea magica (Middleware para parsear el body(concatena chunk) a JSON)
app.use(cors());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

// Rutas de autenticación: POST /api/v1/auth/login
app.use("/api/v1/auth", authRoutes);

// Rutas de usuarios: POST /api/v1/users (registro)
app.use("/api/v1/users", userRoutes);

// Rutas de libros: POST /api/libros
app.use("/api/libros", libroRoutes);

export default app;
