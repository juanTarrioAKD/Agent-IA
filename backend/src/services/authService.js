import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Importamos la librería

export const loginUser = async ({ email, password }) => {
  // 1. Buscar usuario por email
  const user = await prisma.user.findUnique({
    where: { email },
    include: { rol: true } // Traemos el rol para meterlo en el token si queremos
  });

  if (!user) {
    // TIP DE SEGURIDAD: Mensaje genérico para no decir "el email no existe"
    throw new Error('INVALID_CREDENTIALS');
  }

  // 2. Comparar contraseñas (LA CORRECCIÓN)
  // bcrypt toma la plana y la compara contra el hash de la DB
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('INVALID_CREDENTIALS');
  }

  // 3. Generar el Token (El Pasaporte)
  // El payload es lo que viaja encriptado dentro del token
  const token = jwt.sign(
    { 
      id: user.id, 
      rol: user.rol.rol // Guardamos el rol para verificar permisos luego
    }, 
    process.env.JWT_SECRET || 'palabra_secreta_super_segura', // Usar variable de entorno
    { expiresIn: '1d' } // El token expira en 1 día
  );

  // Retornamos el usuario (sin password) y el token
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};