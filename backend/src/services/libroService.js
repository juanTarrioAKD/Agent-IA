import prisma from '../lib/prisma.js';

export const createLibroService = async (data) => {
  // 1. Verificar unicidad: findFirst acepta where por title (findUnique exige id en este cliente)
  const existingBook = await prisma.libro.findFirst({
    where: { title: data.title },
  });

  if (existingBook) {
    throw new Error('Ya existe un libro con ese título exacto');
  }

  // 2. Crear el libro
  const newLibro = await prisma.libro.create({
    data: {
      title: data.title,
      description: data.description,
      image: data.image,
      price: data.price,
      stock: data.stock,
    },
  });

  return newLibro;
};

export const getLibrosService = async () => {
  const libros = await prisma.libro.findMany({
    orderBy: {
      createdAt: 'desc', // Los más nuevos primero
    },
    // Si quisieras traer las relaciones, descomentas esto:
    // include: { posts: true } 
  });
  return libros;
};