import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
          👨‍💻 Kodun Dünyası
        </Link>
        
        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link">Ana Sayfa</Link>
          
          {/* Sadece Giriş Yapılmışsa Yeni Yazı butonu çıksın */}
          {user && isAdmin() && (
            <Link to="/add-post" className="nav-link">✍️ Yeni Yazı</Link>
          )}
          
          {/* MANTIK BURADA: Kullanıcı varsa Hoşgeldin, yoksa Giriş Yap */}
          {user ? (
            <>
              <span className="nav-user">👋 Hoşgeldin, {user.name || 'Admin'}</span>
              <button onClick={handleLogout} className="nav-logout">Çıkış Yap</button>
            </>
          ) : (
            <Link to="/login" className="nav-link">Giriş Yap</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;