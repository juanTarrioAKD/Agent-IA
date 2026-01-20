import { z } from 'zod';

export const createLibroSchema = z.object({
  title: z
    .string({ required_error: "El título es requerido" })
    .min(3, "El título debe tener al menos 3 caracteres"),
  
  description: z.string().optional(),
  
  image: z.string().url("La imagen debe ser una URL válida").optional(),
  
  // Usamos z.coerce.number() por si el dato viene como string desde un form-data
  price: z.coerce
    .number()
    .min(0, "El precio no puede ser negativo")
    .optional(),
    
  stock: z.coerce
    .number()
    .int("El stock debe ser un número entero")
    .min(0)
    .optional(),
});