import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authServices';

// 1. Crear el contexto
const AuthContext = createContext();

// 2. Crear el proveedor (El componente que envolverá tu app)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Al cargar la app, revisamos si ya hay sesión guardada
  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Wrapper para el login
  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, message: error };
    }
  };

  // Wrapper para el registro
  const register = async (userData) => {
    try {
      await authService.register(userData);
      return { success: true };
    } catch (error) {
      return { success: false, message: error };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Hook personalizado para usar el contexto fácil
export const useAuth = () => useContext(AuthContext);