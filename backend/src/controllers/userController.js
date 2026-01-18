import * as userService from '../services/userService.js';

export const create = async (req, res, next) => {
  try {
    // Llamamos al servicio con los datos del body
    const user = await userService.createUser(req.body);

    // 201 Created: Respuesta exitosa estándar
    res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      data: user,
    });

  } catch (error) {
    // Manejo de errores de negocio que lanzamos en el servicio
    if (error.message === 'EMAIL_EXISTS') {
      return res.status(409).json({ // 409 Conflict
        success: false, 
        message: "El correo electrónico ya está registrado" 
      });
    }

    if (error.message === 'DEFAULT_ROL_NOT_CONFIGURED') {
      return res.status(500).json({ 
        success: false, 
        message: "No hay un rol por defecto configurado en el sistema. Contacte al administrador." 
      });
    }

    next(error);
  }
};