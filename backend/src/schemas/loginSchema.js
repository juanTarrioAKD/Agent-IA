import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: "El email es requerido" })
    .email({ message: "Email inválido" }),
  password: z
    .string({ required_error: "La contraseña es requerida" })
    // Aquí basta con que sea string, no hace falta validar longitud 
    // porque si es corta simplemente fallará el login.
});