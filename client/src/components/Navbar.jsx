import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogIn, UserPlus, LogOut, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Clubs', path: '/clubs' },
    { name: 'Events', path: '/events' },
    { name: 'Forum', path: '/forum' },
    { name: 'Faculty', path: '/faculty' },
    { name: 'Notices', path: '/announcements' },
    { name: 'Support', path: '/support' },
    { name: 'Search', path: '/search' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>
          <GraduationCap size={28} color="var(--primary)" />
          CollegeBook
        </Link>
      </div>

      {/* Desktop Links */}
      <ul className={`navbar-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link 
              to={link.path} 
              className={location.pathname === link.path ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          </li>
        ))}
        
        {/* Mobile Auth embedded in menu */}
        <li className="navbar-auth-mobile">
          {user ? (
            <div className="mobile-auth-buttons">
              <Link to="/profile" className="btn-secondary" onClick={() => setMobileMenuOpen(false)}>
                <User size={18} /> {user.name}
              </Link>
              <button onClick={handleLogout} className="btn-logout" title="Logout">
                <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            <div className="mobile-auth-buttons">
              <Link to="/login" className="btn-login" onClick={() => setMobileMenuOpen(false)}><LogIn size={18} /> Login</Link>
              <Link to="/register" className="btn-primary" onClick={() => setMobileMenuOpen(false)}><UserPlus size={18} /> Register</Link>
            </div>
          )}
        </li>
      </ul>

      {/* Desktop Auth */}
      <div className="navbar-auth desktop-only">
        {user ? (
          <>
            <Link to="/profile" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
              <User size={18} /> {user.name}
            </Link>
            <button onClick={handleLogout} className="btn-logout" title="Logout">
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-login"><LogIn size={18} /> Login</Link>
            <Link to="/register" className="btn-primary"><UserPlus size={18} /> Register</Link>
          </>
        )}
      </div>

      <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
    </nav>
  );
};

export default Navbar;
