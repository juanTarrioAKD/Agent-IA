import { Router } from 'express';
import { createLibro } from '../controllers/libro.controller.js';
import { validateSchema } from '../middlewares/validator.middleware.js'; // Tu middleware generico de Zod
import { createLibroSchema } from '../validators/libro.schema.js';

const router = Router();

// POST /api/libros
router.post(
  '/', 
  validateSchema(createLibroSchema), // 1. Valida
  createLibro                        // 2. Ejecuta
);

export default router;