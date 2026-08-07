import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiSettings, FiPackage, FiMenu, FiX } from 'react-icons/fi';
import { MdLocalFlorist } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const isActive = (path) => location.pathname === path ? 'navbar__link active' : 'navbar__link';

  return (
    <nav className="navbar" style={{ boxShadow: scrolled ? '0 4px 30px rgba(194,24,91,0.15)' : undefined }}>
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <MdLocalFlorist className="navbar__logo-icon" style={{ color: '#C2185B' }} />
          <span className="navbar__logo-text">Bloom & Blossom</span>
        </Link>

        {/* Nav Links */}
        <div className="navbar__links">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/shop" className={isActive('/shop')}>Shop</Link>
          <a href="/#offers" className="navbar__link">Offers</a>
          <a href="/#contact" className="navbar__link">Contact</a>
        </div>

        {/* Actions */}
        <div className="navbar__actions">
          <Link to="/cart" className="navbar__cart-btn">
            <FiShoppingCart />
            {cartCount > 0 && <span className="navbar__cart-count">{cartCount}</span>}
          </Link>

          {user ? (
            <div className={`navbar__dropdown ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
              <div className="navbar__avatar" style={{ cursor: 'pointer' }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="navbar__dropdown-menu">
                <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #f0d0e0', marginBottom: '0.3rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9E7A8C' }}>{user.email}</div>
                </div>
                {isAdmin ? (
                  <Link to="/admin" className="dropdown-item"><FiSettings /> Admin Panel</Link>
                ) : (
                  <Link to="/dashboard" className="dropdown-item"><FiPackage /> My Orders</Link>
                )}
                <Link to="/dashboard" className="dropdown-item"><FiUser /> Profile</Link>
                <div className="dropdown-divider" />
                <button className="dropdown-item dropdown-item--danger" onClick={logout}>
                  <FiLogOut /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
