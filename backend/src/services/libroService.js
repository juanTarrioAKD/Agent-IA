import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createLibroService = async (data) => {
  // 1. Verificar unicidad manualmente (Opcional pero recomendado para dar mejor feedback)
  const existingBook = await prisma.libro.findUnique({
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