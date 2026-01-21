import cloudinary from '../config/cloudinary.js';
import { createLibroService } from '../services/libroService.js';
import { getLibrosService } from '../services/libroService.js';

export const createLibro = async (req, res) => {
  try {
    let imageUrl = '';

    // Si el usuario envió una imagen como archivo
    if (req.file) {
      // 1. Convertir el archivo de memoria a base64 para subirlo
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      // 2. Subir a Cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'libreria-app', // Nombre de la carpeta en tu Cloudinary
      });

      imageUrl = result.secure_url; // URL que guardaremos en la BD
    } else if (req.body.image) {
      // Si no hay archivo pero viene una URL en el body, usar esa
      imageUrl = req.body.image;
    }

    // 3. Crear el libro en la BD con la URL (de Cloudinary o la URL proporcionada)
    const newLibro = await createLibroService({
      ...req.body,
      image: imageUrl || '', // Guardamos la URL de la nube o string vacío
    });

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