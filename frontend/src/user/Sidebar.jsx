// Navbar.jsx - Me THE BRAND TEO
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../user/style/Sidebar.css';
import { useCart } from './CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', name: 'Ballina', icon: '🏠', path: '/' },
    { id: 'products', name: 'Produktet', icon: '👗', path: '/products' },
    { id: 'customize', name: 'Personalizo', icon: '✨', path: '/customize' },
    { id: 'about', name: 'Rreth nesh', icon: '📖', path: '/about' },
    { id: 'contact', name: 'Na Kontaktoni', icon: '📞', path: '/contact' }
  ];

  const currentPage = location.pathname === '/' ? 'home' : location.pathname.slice(1);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          {/* Logo - THE BRAND TEO */}
          <div className="nav-logo">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <div className="logo-icon-brand">
                <span className="logo-the">THE</span>
                <span className="logo-brand-name">BRAND</span>
                <span className="logo-teo">TEO</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="nav-links">
            {navItems.map(item => (
              <Link
                key={item.id}
                to={item.path}
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-name">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="nav-actions">
            {/* Cart Button with Counter */}
            <button className="action-btn cart-btn" onClick={() => navigate('/cart')}>
              <span>🛒</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {/* Mobile Menu Button */}
            <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <span className={`menu-icon ${isMenuOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          {navItems.map(item => (
            <Link
              key={item.id}
              to={item.path}
              className={`mobile-nav-link ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="mobile-nav-icon">{item.icon}</span>
              <span className="mobile-nav-name">{item.name}</span>
              <span className="mobile-nav-arrow">→</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div className="nav-overlay" onClick={() => setIsMenuOpen(false)}></div>
      )}
    </>
  );
};

export default Navbar;