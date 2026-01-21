import { Router } from 'express';
import { createLibro, getLibros } from '../controllers/libroController.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { createLibroSchema } from '../schemas/libroSchema.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = Router();

// POST /api/libros
// El middleware de upload debe ir ANTES de validateSchema para que req.file esté disponible
router.post(
  '/', 
  upload.single('image'), // 1. Sube el archivo a memoria (si viene)
  validateSchema(createLibroSchema), // 2. Valida el body (image puede ser opcional)
  createLibro                        // 3. Ejecuta (maneja Cloudinary si hay archivo)
);

router.get('/', getLibros);

export default router;