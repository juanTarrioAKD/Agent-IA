import { z } from 'zod';

export const createUserSchema = z.object({
  email: z
    .string({ required_error: "El email es requerido" })
    .email({ message: "Formato de email inválido" }),
  
  nombre: z
    .string({ required_error: "El nombre es requerido" })
    .min(2, "El nombre debe tener al menos 2 caracteres"),
    
  apellido: z
    .string({ required_error: "El apellido es requerido" })
    .min(2, "El apellido debe tener al menos 2 caracteres"),
    
  // nameUser es opcional en tu DB (String?), así que usamos .optional()
  nameUser: z.string().optional(),
  
  password: z
    .string({ required_error: "La contraseña es requerida" })
    .min(6, "La contraseña debe tener al menos 6 caracteres")
});