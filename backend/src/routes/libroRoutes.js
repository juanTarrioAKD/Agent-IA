import { Router } from 'express';
import { createLibro, getLibros } from '../controllers/libroController.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { createLibroSchema } from '../schemas/libroSchema.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { updateLibro } from '../controllers/libroController.js';
import { updateLibroSchema } from '../schemas/libroSchema.js';

const router = Router();

// POST /api/libros
// El middleware de upload debe ir ANTES de validateSchema para que req.file esté disponible
router.post(
  '/', 
  upload.single('image'), // 1. Sube el archivo a memoria (si viene)
  validateSchema(createLibroSchema), // 2. Valida el body (image puede ser opcional)
  createLibro                        // 3. Ejecuta (maneja Cloudinary si hay archivo)
);

// GET /api/libros - Obtener todos los libros
router.get('/', getLibros);

// PUT /api/libros/:id - Actualizar un libro
// El middleware de upload debe ir ANTES de validateSchema para que req.file esté disponible
router.put('/:id', validateSchema(updateLibroSchema), updateLibro);

export default router;