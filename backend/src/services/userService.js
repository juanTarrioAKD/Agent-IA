import prisma from '../lib/prisma.js'; // Ajusta la ruta a tu instancia singleton
import bcrypt from 'bcryptjs';

export const createUser = async (userData) => {
  const { email, password, ...rest } = userData;

  // 1. Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('EMAIL_EXISTS');
  }

  // 2. Asignar rol por defecto (el frontend no envía rol; se maneja en el servicio)
  const defaultRol = await prisma.rol.findFirst({
    where: { rol: { in: ['Usuario', 'usuario', 'User', 'user'] } }
  }) || await prisma.rol.findFirst();

  if (!defaultRol) {
    throw new Error('DEFAULT_ROL_NOT_CONFIGURED');
  }

  const rolId = defaultRol.id;

  // 3. Encriptar la contraseña (Hash)
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // 4. Crear el usuario en la DB
  const newUser = await prisma.user.create({
    data: {
      email,
      password: passwordHash,
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