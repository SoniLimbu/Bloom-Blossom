import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { orderAPI, userAPI } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import { Link } from 'react-router-dom';
import { MdShoppingBag, MdPeople, MdLocalFlorist, MdAttachMoney, MdPendingActions } from 'react-icons/md';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([orderAPI.getStats(), orderAPI.getAllOrders()])
      .then(([s, o]) => { setStats(s.data); setOrders(o.data.slice(0, 5)); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { icon: <MdShoppingBag />, label: 'Total Orders', value: stats.totalOrders, color: '#C2185B', bg: 'rgba(194,24,91,0.1)', cls: 'stat-card--rose' },
    { icon: <MdAttachMoney />, label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, color: '#22c55e', bg: 'rgba(34,197,94,0.1)', cls: 'stat-card--green' },
    { icon: <MdPendingActions />, label: 'Pending Orders', value: stats.pendingOrders, color: '#FFB300', bg: 'rgba(255,179,0,0.1)', cls: 'stat-card--gold' },
    { icon: <MdLocalFlorist />, label: 'Delivered', value: stats.deliveredOrders, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', cls: 'stat-card--blue' },
  ] : [];

  const statusColors = {
    pending: 'badge--pending', confirmed: 'badge--confirmed',
    processing: 'badge--processing', shipped: 'badge--shipped',
    delivered: 'badge--delivered', cancelled: 'badge--cancelled',
  };

  return (
    <>
      <Helmet><title>Admin Dashboard — Bloom & Blossom</title></Helmet>
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">
          <div className="admin-header">
            <h1 className="admin-title">🌸 Dashboard Overview</h1>
            <span style={{ color: '#9E7A8C', fontSize: '0.88rem' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

          {loading ? (
            <div className="loading-overlay"><div className="spinner" /></div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid-4" style={{ marginBottom: '2rem' }}>
                {statCards.map((s, i) => (
                  <div key={i} className={`stat-card ${s.cls}`}>
                    <div className="stat-card__icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                    <div className="stat-card__value">{s.value}</div>
                    <div className="stat-card__label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem' }}>Recent Orders</h3>
                  <Link to="/admin/orders" className="btn btn-outline btn-sm">View All</Link>
                </div>
                <div className="table-wrapper">
                  <table className="table">
                    <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o._id}>
                          <td><code style={{ fontSize: '0.8rem' }}>#{o._id.slice(-8).toUpperCase()}</code></td>
                          <td>{o.user?.name || 'N/A'}</td>
                          <td>{o.orderItems?.length} item(s)</td>
                          <td style={{ fontWeight: 600, color: '#C2185B' }}>₹{o.totalPrice?.toLocaleString()}</td>
                          <td><span className={`badge ${statusColors[o.status] || ''}`} style={{ textTransform: 'capitalize' }}>{o.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
