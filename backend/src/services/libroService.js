import prisma from '../lib/prisma.js';
import { findOrCreateAuthorService } from './authorService.js';

export const createLibroService = async (data) => {
  /*
  Metodo encargado de crear un nuevo libro el cual recibe:
  title: string (requerido y unico) - Titulo del libro
  description: string (opcional) - Descripcion del libro
  image: string (opcional) - URL de la imagen del libro
  price: number (opcional y no negativo) - Precio del libro 
  stock: number (opcional y no negativo) - Stock del libro
  authorId: number (opcional) - ID del autor si se seleccionó uno existente
  authorName: string (opcional) - Nombre del autor si se crea uno nuevo
  y retorna el libro creado o lanza un error si no se puede crear
  */
  const { authorId, authorName, ...libroData } = data;

  // Debug: Ver qué está llegando
  console.log('createLibroService - data recibida:', { authorId, authorName, title: libroData.title });

  // Usamos transacción para asegurar integridad: si falla la creación del libro, 
  // se deshace la creación del autor (si se creó uno nuevo)
  return await prisma.$transaction(async (tx) => {
    // 1. Verificar unicidad del título dentro de la transacción
    const existingBook = await tx.libro.findFirst({
      where: { title: libroData.title, deleted: false },
    });

    if (existingBook) {
      throw new Error('Ya existe un libro con ese título exacto');
    }

    // 2. Resolver el autor: si viene authorId lo usamos, si viene authorName lo buscamos o creamos
    // Normalizamos authorId: si es 0, NaN, null, undefined, lo tratamos como undefined
    let finalAuthorId = (authorId && !isNaN(authorId) && authorId > 0) ? Number(authorId) : undefined;

    if (!finalAuthorId && authorName && authorName.trim()) {
      console.log('createLibroService - Creando/buscando autor:', authorName);
      try {
        // Delegamos al servicio de autores, pasando la transacción 'tx'
        const author = await findOrCreateAuthorService(authorName.trim(), tx);
        finalAuthorId = author.id;
        console.log('createLibroService - Autor encontrado/creado con ID:', finalAuthorId);
      } catch (error) {
        console.error('createLibroService - Error al crear/buscar autor:', error);
        throw error;
      }
    } else {
      console.log('createLibroService - No se proporcionó autor o ya hay authorId:', { authorId, finalAuthorId, authorName });
    }

    // 3. Crear el libro usando la misma transacción 'tx'
    const newLibro = await tx.libro.create({
      data: {
        ...libroData,
        authorId: finalAuthorId, // Puede ser undefined si no se proporcionó autor
        // Si authorId es undefined, Prisma lo ignorará (ya que es opcional en el schema)
      },
      include: {
        author: true, // Incluimos el autor en la respuesta
      },
    });

    return newLibro;
  });
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
    include: {
      author: true, // Incluimos la relación con el autor
      // Si quisieras traer las reviews también:
      // reviews: true 
    }
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