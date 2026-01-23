import prisma from '../lib/prisma.js';

/**
 * Busca un autor por nombre o lo crea si no existe.
 * @param {string} name - Nombre del autor
 * @param {Object} [tx] - Cliente de transacción de Prisma (Opcional). Si no se proporciona, usa la instancia global.
 * @returns {Promise<Object>} El autor encontrado o creado
 */
export const findOrCreateAuthorService = async (name, tx = prisma) => {
  const cleanName = name.trim();

  if (!cleanName) {
    throw new Error('El nombre del autor no puede estar vacío');
  }

  // 1. Buscamos si existe (usando 'tx' que puede ser la transacción o el cliente normal)
  const existingAuthor = await tx.author.findFirst({
    where: { 
      name: cleanName,
      deleted: false 
    }
  });

  if (existingAuthor) {
    return existingAuthor;
  }

  // 2. Si no existe, lo creamos
  return await tx.author.create({
    data: { name: cleanName }
  });
};