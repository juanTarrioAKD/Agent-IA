import prisma from '../lib/prisma.js';

export const createLibroService = async (data) => {
  /*
  Metodo encargado de crear un nuevo libro el cual recibe:
  title: string (requerido y unico) - Titulo del libro
  description: string (opcional) - Descripcion del libro
  image: string (opcional) - URL de la imagen del libro
  price: number (opcional y no negativo) - Precio del libro 
  stock: number (opcional y no negativo) - Stock del libro
  y retorna el libro creado o lanza un error si no se puede crear
  */
  // 1. Verificar unicidad: findFirst acepta where por title (findUnique exige id en este cliente)
  const existingBook = await prisma.libro.findFirst({
    where: { title: data.title, deleted: false },
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
  /*
  Metodo encargado de obtener todos los libros el cual retorna 
  un array de libros y los ordena por fecha de creacion de manera descendente
  o lanza un error si no se pueden obtener
  */
  const libros = await prisma.libro.findMany({
    where: { deleted: false },
    orderBy: {
      createdAt: 'desc', // Los más nuevos primero
    },
    // Si quisieras traer las relaciones, descomentas esto:
    // include: { posts: true } 
  });
  return libros;
};

export const updateLibroService = async (id, data) => {
  /*
  Metodo encargado de actualizar un libro el cual recibe:
  id: number (requerido) - ID del libro a actualizar
  data: object (requerido) - Objeto con los datos a actualizar
  y retorna el libro actualizado o lanza un error si no se puede actualizar
  */
  // Primero intentamos actualizar
  // Si el ID no existe, Prisma lanzará un error P2025
  return await prisma.libro.update({
    where: { id: id },
    data: data // Pasamos el objeto tal cual llega (ya validado)
  });
};