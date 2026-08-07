import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdDashboard, MdLocalFlorist, MdShoppingBag, MdPeople, MdLocalOffer } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const links = [
  { path: '/admin', icon: <MdDashboard />, label: 'Dashboard' },
  { path: '/admin/products', icon: <MdLocalFlorist />, label: 'Products' },
  { path: '/admin/orders', icon: <MdShoppingBag />, label: 'Orders' },
  { path: '/admin/offers', icon: <MdLocalOffer />, label: 'Offers' },
  { path: '/admin/users', icon: <MdPeople />, label: 'Customers' },
];

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__logo">
        <div className="admin-sidebar__logo-text">🌸 Bloom & Blossom</div>
        <div className="admin-sidebar__logo-sub">Admin Panel</div>
      </div>
      <nav className="admin-sidebar__nav">
        {links.map(l => (
          <Link
            key={l.path}
            to={l.path}
            className={`admin-sidebar__link ${pathname === l.path ? 'active' : ''}`}
          >
            {l.icon}
            {l.label}
          </Link>
        ))}
      </nav>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: '1rem' }}>
        <div style={{ padding: '0.5rem 1rem', marginBottom: '0.5rem' }}>
          <div style={{ color: 'white', fontSize: '0.88rem', fontWeight: 600 }}>{user?.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Administrator</div>
        </div>
        <button onClick={handleLogout} className="admin-sidebar__link" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
          <FiLogOut /> Sign Out
        </button>
      </div>
    </aside>
  );
}