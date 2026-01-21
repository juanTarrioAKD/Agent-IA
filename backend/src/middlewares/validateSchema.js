export const validateSchema = (schema) => (req, res, next) => {
    try {
      // 1. Validamos Y TRANSFORMAMOS los datos
      // Zod toma los strings de FormData y los convierte a números aquí (gracias a z.coerce)
      const dataParseada = schema.parse(req.body);

      // 2. ¡IMPORTANTE! Reemplazamos el body sucio (strings) con el limpio (números transformados)
      req.body = dataParseada;

      next(); // Si todo está bien, pasa al siguiente paso (el controlador)
    } catch (error) {
      // Zod usa `issues`, no `errors`. Si no hay issues (p. ej. error no-Zod), mensaje genérico.
      const issues = error?.issues;
      const errors = Array.isArray(issues)
        ? issues.map((e) => ({ field: e.path?.[0] ?? "unknown", message: e.message }))
        : [{ field: "body", message: error?.message ?? "Error de validación" }];

      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors,
      });
    }
  };