// Manejador de errores global.
// Debe registrarse en app.js DESPUÉS de todas las rutas.
// Express identifica un error handler por su aridad: tiene que recibir 4 parámetros.
export const errorHandler = (err, req, res, next) => {
  // Si ya se empezó a enviar la respuesta, delegamos al handler por defecto de Express
  if (res.headersSent) {
    return next(err);
  }

  // Log completo en el servidor (esto es lo que ves en la terminal de nodemon)
  console.error(`❌ ${req.method} ${req.originalUrl}`, err);

  const isDev = process.env.NODE_ENV !== 'production';

  // --- Errores de conexión / autenticación contra PostgreSQL ---
  // 28P01: password incorrecta | 3D000: la base no existe | 28000: usuario inválido
  // ECONNREFUSED: el servidor no está levantado | 53100: disco lleno
  const dbErrorCodes = {
    '28P01': 'No se pudo autenticar contra la base de datos. Revisá el usuario y la contraseña en DATABASE_URL.',
    '28000': 'Usuario de base de datos inválido. Revisá DATABASE_URL.',
    '3D000': 'La base de datos indicada en DATABASE_URL no existe.',
    '53100': 'El servidor de base de datos se quedó sin espacio en disco.',
    ECONNREFUSED: 'No hay un servidor de base de datos escuchando en el host/puerto de DATABASE_URL.',
    ETIMEDOUT: 'Timeout al conectar con la base de datos.',
  };

  const dbMessage = dbErrorCodes[err.code];
  if (dbMessage) {
    return res.status(503).json({
      success: false,
      message: dbMessage,
      code: err.code,
      ...(isDev && { detail: err.message }),
    });
  }

  // --- Errores de conexión de Prisma (P1xxx) ---
  // Ojo: Prisma los reporta como KnownRequestError, pero son fallas de infraestructura,
  // no de la consulta. Van con 503 para distinguirlos de un error de datos.
  const prismaConnErrors = {
    P1000: 'Autenticación fallida contra la base de datos. Revisá usuario y contraseña en DATABASE_URL.',
    P1001: 'No se puede alcanzar el servidor de base de datos. ¿Está corriendo PostgreSQL en el host/puerto de DATABASE_URL?',
    P1002: 'Timeout al conectar con la base de datos.',
    P1003: 'La base de datos indicada en DATABASE_URL no existe.',
    P1008: 'La operación contra la base de datos superó el tiempo límite.',
    P1010: 'El usuario configurado no tiene acceso a la base de datos.',
    P1017: 'El servidor de base de datos cerró la conexión.',
  };

  if (prismaConnErrors[err.code]) {
    return res.status(503).json({
      success: false,
      message: prismaConnErrors[err.code],
      code: err.code,
      ...(isDev && { detail: err.message }),
    });
  }

  // --- Errores conocidos de Prisma ---
  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      const campos = err.meta?.target?.join(', ') ?? 'un campo único';
      return res.status(409).json({
        success: false,
        message: `Ya existe un registro con ese valor (${campos}).`,
        code: err.code,
      });
    }

    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'El registro solicitado no existe.',
        code: err.code,
      });
    }

    if (err.code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'Referencia inválida: el registro relacionado no existe.',
        code: err.code,
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Error en la consulta a la base de datos.',
      code: err.code,
      ...(isDev && { detail: err.message }),
    });
  }

  // Prisma no logró inicializar el motor / conectar (envuelve los errores del adaptador pg)
  if (err.name === 'PrismaClientInitializationError') {
    return res.status(503).json({
      success: false,
      message: 'No se pudo conectar con la base de datos. Revisá DATABASE_URL y que PostgreSQL esté corriendo.',
      ...(isDev && { detail: err.message }),
    });
  }

  if (err.name === 'PrismaClientValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Los datos enviados no coinciden con el modelo de la base de datos.',
      ...(isDev && { detail: err.message }),
    });
  }

  // --- JSON malformado en el body (lo lanza express.json()) ---
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'El body enviado no es JSON válido.',
    });
  }

  // --- Errores de JWT ---
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Token inválido.' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'El token expiró. Volvé a iniciar sesión.' });
  }

  // --- Cualquier otro error ---
  const status = err.status || err.statusCode || 500;

  return res.status(status).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(isDev && { stack: err.stack }),
  });
};

export default errorHandler;
