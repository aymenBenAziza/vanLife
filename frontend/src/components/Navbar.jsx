import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../modules/users/useAuth.js';

export const Navbar = ({ publicMode = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const canManageFleet = ['admin', 'staff'].includes(user?.role);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <header className="site-nav-shell">
      <div className="site-nav">
        <NavLink className="brand-link" to="/">
          <span className="brand-mark">V</span>
          <div>
            <strong>VanLife</strong>
            <span>Camper rental platform</span>
          </div>
        </NavLink>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span className={`burger-line ${isMenuOpen ? 'is-open' : ''}`} />
          <span className={`burger-line ${isMenuOpen ? 'is-open' : ''}`} />
          <span className={`burger-line ${isMenuOpen ? 'is-open' : ''}`} />
        </button>

        <nav className={`nav-links ${isMenuOpen ? 'is-open' : ''}`}>
          <NavLink className="nav-link" to="/" end>
            Home
          </NavLink>

          {!isAuthenticated && publicMode ? (
            <>
              <NavLink className="nav-link" to="/login">
                Login
              </NavLink>
              <NavLink className="nav-link" to="/signup">
                Sign up
              </NavLink>
            </>
          ) : null}

          {isAuthenticated && !publicMode ? (
            <>
              <NavLink className="nav-link" to="/profile">
                Profile
              </NavLink>
              {canManageFleet ? (
                <>
                  <NavLink className="nav-link" to="/fleet" end>
                    Vehicles
                  </NavLink>
                  <NavLink className="nav-link" to="/fleet/documents">
                    Documents
                  </NavLink>
                </>
              ) : null}
              {user?.role === 'admin' ? (
                <NavLink className="nav-link" to="/admin">
                  Admin
                </NavLink>
              ) : null}
            </>
          ) : null}
        </nav>

        <div className={`nav-actions ${isMenuOpen ? 'is-open' : ''}`}>
          {isAuthenticated ? (
            <>
              <div className="nav-user">
                <strong>
                  {user?.firstName} {user?.lastName}
                </strong>
                <span>{user?.role}</span>
              </div>
              <button type="button" className="secondary-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            !publicMode && (
              <>
                <NavLink className="secondary-button" to="/login">
                  Login
                </NavLink>
                <NavLink className="secondary-button" to="/signup">
                  Sign up
                </NavLink>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
};
