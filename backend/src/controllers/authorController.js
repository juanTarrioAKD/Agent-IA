import prisma from '../lib/prisma.js';

// GET: Traer autores para el selector (ordenados alfabéticamente)
export const getAuthors = async (req, res) => {
  try {
    const authors = await prisma.author.findMany({
      where: { deleted: false },
      orderBy: { name: 'asc' },
      select: { id: true, name: true } // Solo necesitamos ID y Nombre para el select
    });
    res.json({ success: true, data: authors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST: Crear autor simple
export const createAuthor = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "El nombre del autor es requerido" });
    }

    const author = await prisma.author.create({
      data: { name: name.trim() }
    });
    res.status(201).json({ success: true, data: author });
  } catch (error) {
    // Manejar error de duplicado (código P2002 de Prisma)
    if (error.code === 'P2002') {
        return res.status(409).json({ success: false, message: "El autor ya existe" });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};