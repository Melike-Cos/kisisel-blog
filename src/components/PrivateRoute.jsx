import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('PrivateRoute - user:', user, 'loading:', loading);

  if (loading) {
    return <div className="loading-container">Yükleniyor...</div>;
  }

  if (!user) {
    console.log('Kullanıcı yok, login sayfasına yönlendiriliyor');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;