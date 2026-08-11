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

  // LÓGICA DE AUTOR:
  // authorId es opcional (porque puede que envíe nombre)
  // Preprocesamos strings vacíos a undefined para que .optional() funcione correctamente
  authorId: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : val),
    z.coerce.number().int().optional()
  ),
  // authorName es opcional (porque puede que envíe ID)
  // Preprocesamos strings vacíos a undefined
  authorName: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : val),
    z.string().min(2, "El nombre del autor es muy corto").optional()
  ),
  
}).refine((data) => data.authorId || data.authorName, {
  // VALIDACIÓN PERSONALIZADA:
  // "Si no hay ID y tampoco hay Nombre, lanza error".
  message: "Debes seleccionar un autor existente o escribir el nombre de uno nuevo.",
  path: ["authorName"], // El error aparecerá en el campo nombre
});

// Esquema para Update: todos los campos opcionales, sin refinamiento de autor obligatorio
export const updateLibroSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres").optional(),
  description: z.string().optional(),
  image: z.union([z.string().url("La imagen debe ser una URL válida"), z.literal("")]).optional(),
  price: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : val),
    z.coerce.number().min(0, "El precio no puede ser negativo").optional()
  ),
  stock: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : val),
    z.coerce.number().int("El stock debe ser un número entero").min(0).optional()
  ),
  authorId: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : val),
    z.coerce.number().int().optional()
  ),
  authorName: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : val),
    z.string().min(2, "El nombre del autor es muy corto").optional()
  ),
  deleted: z.boolean().optional()
});
