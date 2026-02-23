import { createContext, useState, useContext, useEffect } from 'react';
import * as authService from '../api/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      const token = data.token || data.data?.token;
      // Backend'den gelen kullanıcı bilgisini veya varsayılanı ayarla
      const userData = data.user || { email, role: 'Admin', name: 'Admin' };

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      return { success: false, error: 'Giriş başarısız' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // BU KISIM ÇOK ÖNEMLİ: Fonksiyon olarak dışarı veriyoruz
  const isAdmin = () => {
    return user?.role === 'Admin' || !!user; // Kullanıcı varsa admin say (şimdilik)
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);