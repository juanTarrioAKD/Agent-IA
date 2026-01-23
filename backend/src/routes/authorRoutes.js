import { Router } from 'express';
import { getAuthors, createAuthor } from '../controllers/authorController.js';

const router = Router();

router.get('/', getAuthors); // Para llenar el select
router.post('/', createAuthor); // Por si quieren crear solo autor

export default router;