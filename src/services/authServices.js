import axios from 'axios';

// URL base: debe incluir /api/v1 (ej: http://localhost:3000/api/v1)
// Crear .env con: VITE_API_URL=http://localhost:3000/api/v1
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  // Función para registrar
  async register(userData) {
    try {
      // Axios lanza error automáticamente si el status no es 2xx
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      // Normalizamos el error para que el frontend reciba siempre un mensaje claro
      throw error.response?.data?.message || 'Error al registrar usuario';
    }
  },

  // Función para loguear
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        // Guardamos en localStorage automáticamente
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error al iniciar sesión';
    }
  },

  // Función para cerrar sesión
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener usuario actual (útil al recargar la página)
  getCurrentUser() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }
};