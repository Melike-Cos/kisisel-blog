import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError('Hatalı email veya şifre!');
      }
    } catch (err) {
      setError('Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>KODUMUN DÜNYASI</h1>
          <p>Admin Paneline Hoş Geldiniz</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <label className="form-label">E-posta</label>
          <div className="input-group">
            <span className="input-icon">📧</span>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@simpleecommerce.com"
              disabled={loading}
              required
            />
          </div>

          <label className="form-label">Şifre</label>
          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin123!"
              disabled={loading}
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'GİRİŞ YAPILIYOR...' : 'GİRİŞ YAP'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>🔐 Giriş Bilgileri</p>
          <p>📧 admin@simpleecommerce.com</p>
          <p>🔑 Admin123!</p>
        </div>
      </div>
    </div>
  );
};
// *** BU SATIR ÇOK ÖNEMLİ!  Olmayınca çalışmıyor ***
export default LoginPage;