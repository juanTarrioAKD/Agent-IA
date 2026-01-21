import { Router } from 'express';
import { createLibro } from '../controllers/libroController.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { createLibroSchema } from '../schemas/libroSchema.js';
import { getLibros } from '../controllers/libroController.js';

const router = Router();

// POST /api/libros
router.post(
  '/', 
  validateSchema(createLibroSchema), // 1. Valida
  createLibro                        // 2. Ejecuta
);
router.get('/', getLibros);

export default router;