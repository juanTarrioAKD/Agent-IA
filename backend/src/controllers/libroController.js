import { createLibroService } from '../services/libro.service.js';

export const createLibro = async (req, res) => {
  try {
    // req.body ya viene validado gracias al middleware de Zod
    const newLibro = await createLibroService(req.body);

    return res.status(201).json({
      success: true,
      message: 'Libro creado exitosamente',
      data: newLibro,
    });
    
  } catch (error) {
    // Manejo de errores básico
    if (error.message === 'Ya existe un libro con ese título exacto') {
        return res.status(409).json({ success: false, message: error.message });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno al crear el libro',
      error: error.message,
    });
  }
};