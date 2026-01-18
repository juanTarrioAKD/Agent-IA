import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // 1. Buscamos el header de autorización
  // El frontend suele enviarlo como: "Authorization: Bearer <token_largo>"
  const authHeader = req.headers['authorization'];

  // Si no hay header, ni siquiera intentamos procesar
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Acceso denegado. Token no proporcionado."
    });
  }

  // 2. Extraemos el token real
  // .split(' ') divide el string en ["Bearer", "eyJhbG..."]
  // Tomamos la posición [1] que es el token
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Formato de token inválido. Se espera 'Bearer <token>'"
    });
  }

  try {
    // 3. Verificamos la firma usando la CLAVE SECRETA
    // Si el token expiró o fue modificado, esta línea lanza un error automáticamente (va al catch)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'palabra_secreta_super_segura');

    // 4. Inyección de dependencias (La parte mágica)
    // Guardamos los datos del usuario (id, rol) dentro de la request.
    // A partir de aquí, cualquier controlador siguiente tendrá acceso a 'req.user'
    req.user = decoded;

    // 5. Todo OK, pase adelante
    next();

  } catch (error) {
    // Diferenciamos si expiró o si es falso
    const message = error.name === 'TokenExpiredError' 
      ? "El token ha expirado. Por favor inicia sesión nuevamente."
      : "Token inválido.";

    return res.status(403).json({
      success: false,
      message: message
    });
  }
};