import "dotenv/config";
import { PrismaClient } from "./src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import app from "./src/app.js";

// Verificar que DATABASE_URL esté cargada
if (!process.env.DATABASE_URL) {
  console.error("❌ Error: DATABASE_URL no está definida en el archivo .env");
  process.exit(1);
}

console.log("✅ DATABASE_URL cargada:", process.env.DATABASE_URL ? "Sí (oculta por seguridad)" : "No");

// En Prisma 7.2, usar adapter de pg para conexión directa
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

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
