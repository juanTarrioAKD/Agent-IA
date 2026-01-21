import multer from 'multer';

// Guardamos la imagen en la memoria RAM temporalmente
const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });