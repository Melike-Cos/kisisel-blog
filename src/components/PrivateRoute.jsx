import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth(); // AuthContext'ten sadece bunları alıyoruz

  // Sayfa ilk açıldığında login durumu kontrol ediliyorsa spinner göster
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir [cite: 44]
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Giriş yapılmışsa sayfayı göster
  return children;
};

export default PrivateRoute;