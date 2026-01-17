export const validateSchema = (schema) => (req, res, next) => {
    try {
      // Intenta parsear el body contra el esquema de Zod
      schema.parse(req.body);
      next(); // Si todo está bien, pasa al siguiente paso (el controlador)
    } catch (error) {
      // Si falla, devuelve un 400 Bad Request con los errores formateados
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: error.errors.map((e) => ({ field: e.path[0], message: e.message }))
      });
    }
  };