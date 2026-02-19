import { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin } from '../api/blogAPI';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Token state'i EKLENDİ!
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token'); // Token'ı da al
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken); // Token'ı state'e ekle
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const result = await apiLogin(email, password);
      
      if (result.success) {
        // Token ve user bilgilerini kaydet - BURASI ÖNEMLİ!
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        setToken(result.token); // Token'ı state'e ekle
        setUser(result.user);
        
        return { success: true };
      }
      
      return { success: false, error: result.error };
      
    } catch (error) {
      return { success: false, error: 'Giriş başarısız' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, // Token'ı da provider'a ekle!
      loading, 
      login, 
      logout, 
      isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};