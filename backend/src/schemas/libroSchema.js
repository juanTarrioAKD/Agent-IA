import { z } from 'zod';

export const createLibroSchema = z.object({
  title: z
    .string({ required_error: "El título es requerido" })
    .min(3, "El título debe tener al menos 3 caracteres"),
  
  description: z.string().optional(),
  
  // Acepta URL válida, string vacío (sin imagen) o undefined
  image: z.union([z.string().url("La imagen debe ser una URL válida"), z.literal("")]).optional(),
  
  // Usamos z.coerce.number() para convertir strings de FormData a números
  // Preprocesamos strings vacíos a undefined para que .optional() funcione correctamente
  price: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : val),
    z.coerce.number().min(0, "El precio no puede ser negativo").optional()
  ),
    
  stock: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : val),
    z.coerce.number().int("El stock debe ser un número entero").min(0).optional()
  ),
});