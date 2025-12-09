// frontend/src/components/Header.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    // Fecha o menu se clicar fora
    function onDocClick(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <h1>📚 Livraria</h1>
        </Link>
        
        <nav className="nav">
          {user ? (
            <>
              <Link to="/" className="nav-link">Início</Link>
              <Link to="/livros" className="nav-link">Livros</Link>
              <Link to="/favoritos" className="nav-link">Favoritos</Link>
              <Link to="/reviews" className="nav-link">Reviews</Link>

              <div className="user-info">
                <span className="greeting">Olá, {user.username || user.email}!</span>

                <div className="settings" ref={menuRef}>
                  <button
                    className="icon-settings"
                    onClick={(e) => { e.stopPropagation(); setOpen(s => !s); }}
                    aria-haspopup="true"
                    aria-expanded={open}
                    title="Configurações"
                  >
                    ⚙️
                  </button>

                  {open && (
                    <div className="settings-menu" role="menu">
                      <div className="settings-row">
                        <div>
                          <strong>Tema</strong>
                          <div className="settings-note">Atual: {theme}</div>
                        </div>
                        <div>
                          <label className="switch" title="Alternar tema">
                            <input
                              type="checkbox"
                              checked={theme === 'dark'}
                              onChange={() => toggleTheme()}
                              aria-label="Alternar tema claro/escuro"
                            />
                            <span className="slider" />
                          </label>
                        </div>
                      </div>

                      <div className="settings-divider" />

                      <button className="btn btn-secondary" onClick={handleLogout}>Sair</button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Registrar</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
