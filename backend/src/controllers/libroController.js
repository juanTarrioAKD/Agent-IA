import { createLibroService } from '../services/libroService.js';
import { getLibrosService } from '../services/libroService.js';

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
    console.error('createLibro error:', error);
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

export const getLibros = async (req, res) => {
  try {
    const libros = await getLibrosService();
    
    return res.status(200).json({
      success: true,
      data: libros, // Esto será un array []
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los libros',
      error: error.message,
    });
  }
};