import { Router } from 'express';
import { create } from '../controllers/userController.js';
import { validateSchema } from '../middlewares/validateSchema.js'; // Paso 2
import { createUserSchema } from '../schemas/userSchema.js';       // Paso 1

const router = Router();

// POST /api/users
// Flujo: Request -> ValidateSchema (Zod) -> Controller -> Service -> DB
router.post('/', validateSchema(createUserSchema), create);

export default router;