import prisma from '../lib/prisma.js'; // Ajusta la ruta a tu instancia singleton
import bcrypt from 'bcryptjs';

export const createUser = async (userData) => {
  const { email, password, rolId, ...rest } = userData;

  // 1. Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    // Lanzamos un error controlado para que el controlador lo capture
    throw new Error('EMAIL_EXISTS');
  }

  // 2. Verificar si el Rol existe (Buena práctica de integridad)
  const existingRol = await prisma.rol.findUnique({
    where: { id: rolId }
  });

  if (!existingRol) {
    throw new Error('ROL_NOT_FOUND');
  }

  // 3. Encriptar la contraseña (Hash)
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // 4. Crear el usuario en la DB
  const newUser = await prisma.user.create({
    data: {
      email,
      password: passwordHash, // Guardamos el hash, no el texto plano
      rolId,
      ...rest, // nombre, apellido, nameUser
    },
    // SELECT: Importante para NO devolver la contraseña al frontend
    select: {
      id: true,
      email: true,
      nombre: true,
      apellido: true,
      nameUser: true,
      createdAt: true,
      rol: { // Podemos devolver información básica del rol si queremos
        select: {
          rol: true
        }
      }
    },
  });

  return newUser;
};