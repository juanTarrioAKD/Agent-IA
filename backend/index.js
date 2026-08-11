import "dotenv/config";
import app from "./src/app.js";
import prisma from "./src/lib/prisma.js";

// Verificar que DATABASE_URL esté cargada
if (!process.env.DATABASE_URL) {
  console.error("❌ Error: DATABASE_URL no está definida en el archivo .env");
  process.exit(1);
}

console.log("✅ DATABASE_URL cargada:", process.env.DATABASE_URL ? "Sí (oculta por seguridad)" : "No");

const PORT = process.env.PORT || 3000;

// Test de conexión a la DB
app.get("/db-test", async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ message: "Conectado a PostgreSQL correctamente ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al conectar con la DB ❌" });
  }
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
