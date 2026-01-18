import * as authService from '../services/authService.js';

export const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login exitoso",
      token, // El frontend guardará esto (localStorage/Cookie)
      user
    });

  } catch (error) {
    // Capturamos el error genérico del servicio
    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ // 401 Unauthorized
        success: false,
        message: "Credenciales inválidas" // No decimos qué falló exactamente
      });
    }
    next(error);
  }
};