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

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          👨‍💻 Kodumun Dünyası
        </Link>
        
        <div 
          className={`hamburger-menu ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>
            Ana Sayfa
          </Link>
          
          {user && isAdmin() && (
            <Link to="/add-post" className="nav-link" onClick={closeMenu}>
              ✍️ Yeni Yazı
            </Link>
          )}
          
          {user ? (
            <>
              <span className="nav-user">
                👋 Hoşgeldin, Admin
              </span>
              <button onClick={handleLogout} className="nav-logout">
                Çıkış Yap
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link" onClick={closeMenu}>
              Giriş Yap
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;