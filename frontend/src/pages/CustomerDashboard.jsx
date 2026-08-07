import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { orderAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiPackage, FiUser, FiEdit } from 'react-icons/fi';

const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

const statusColors = {
  pending: 'badge--pending', confirmed: 'badge--confirmed',
  processing: 'badge--processing', shipped: 'badge--shipped',
  delivered: 'badge--delivered', cancelled: 'badge--cancelled',
};

export default function CustomerDashboard() {
  const { user, updateUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    orderAPI.getMyOrders().then(r => setOrders(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleCancelOrder = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await orderAPI.cancelOrder(id);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: 'cancelled' } : o));
      toast.success('Order cancelled');
    } catch (err) { toast.error(err.response?.data?.message || 'Cancel failed'); }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(profileForm);
      updateUser(res.data);
      toast.success('Profile updated! 🌸');
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  return (
    <>
      <Helmet><title>My Dashboard — Bloom & Blossom</title></Helmet>
      <div className="customer-dash">
        <div className="container" style={{ paddingBottom: '5rem' }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #FFF8F0, #F8BBD9)', borderRadius: '20px', padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700 }}>
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', marginBottom: '0.25rem' }}>
                Welcome, {user?.name}! 🌸
              </h1>
              <p style={{ color: '#6B4C5E', fontSize: '0.9rem' }}>{user?.email}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="dash-tabs">
            <button className={`dash-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
              <FiPackage style={{ marginRight: '0.4rem' }} /> My Orders ({orders.length})
            </button>
            <button className={`dash-tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
              <FiUser style={{ marginRight: '0.4rem' }} /> My Profile
            </button>
          </div>

          {/* Orders Tab */}
          {tab === 'orders' && (
            <div>
              {loading ? (
                <div className="loading-overlay"><div className="spinner" /></div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state__icon">📦</div>
                  <h3 className="empty-state__title">No Orders Yet</h3>
                  <p className="empty-state__desc">Start shopping and your orders will appear here!</p>
                  <a href="/shop" className="btn btn-primary">Shop Now 🌸</a>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {orders.map(order => (
                    <div key={order._id} className="card" style={{ padding: '1.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#9E7A8C', marginBottom: '0.25rem' }}>Order #{order._id.slice(-8).toUpperCase()}</div>
                          <div style={{ fontSize: '0.82rem', color: '#9E7A8C' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <span className={`badge ${statusColors[order.status] || ''}`} style={{ textTransform: 'capitalize' }}>{order.status}</span>
                          {['pending', 'confirmed'].includes(order.status) && (
                            <button className="btn btn-sm btn-danger" onClick={() => handleCancelOrder(order._id)}>Cancel</button>
                          )}
                        </div>
                      </div>
                      {/* Order items */}
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        {order.orderItems.map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: '#FFF8F0', borderRadius: '10px', padding: '0.5rem 0.75rem' }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{item.name}</span>
                            <span style={{ fontSize: '0.78rem', color: '#9E7A8C' }}>×{item.qty}</span>
                            {item.freeQty > 0 && <span style={{ fontSize: '0.72rem', color: '#22c55e', fontWeight: 600 }}>+{item.freeQty} FREE</span>}
                          </div>
                        ))}
                      </div>
                      {/* Specials */}
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                        {order.giftHamperAdded && <span style={{ background: '#FFF8E1', color: '#FF6F00', borderRadius: '50px', padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: 600 }}>🎁 FREE Gift Hamper included</span>}
                        {order.buy2get1Applied && <span style={{ background: '#d1fae5', color: '#059669', borderRadius: '50px', padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: 600 }}>✅ Buy 2 Get 1 Applied</span>}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <strong style={{ color: '#C2185B' }}>Total: ₹{order.totalPrice.toLocaleString()}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {tab === 'profile' && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: 'var(--shadow)', maxWidth: '500px' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.5rem' }}>Edit Profile</h3>
              <form onSubmit={handleProfileSave}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" value={user?.email} disabled style={{ background: '#f9f3f6', cursor: 'not-allowed' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} placeholder="Phone number" />
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
