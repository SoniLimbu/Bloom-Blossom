import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { orderAPI } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import toast from 'react-hot-toast';
import { FiEye, FiX, FiGift, FiTag } from 'react-icons/fi';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusColors = {
  pending: 'badge--pending',
  confirmed: 'badge--confirmed',
  processing: 'badge--processing',
  shipped: 'badge--shipped',
  delivered: 'badge--delivered',
  cancelled: 'badge--cancelled',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    orderAPI.getAllOrders()
      .then(r => setOrders(r.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchOrders, []);

  const handleStatusChange = async (id, status) => {
    setUpdating(true);
    try {
      const { data } = await orderAPI.updateStatus(id, status);
      setOrders(prev => prev.map(o => (o._id === id ? data : o)));
      if (selected?._id === id) setSelected(data);
      toast.success(`Order marked as ${status}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <>
      <Helmet><title>Orders — Admin</title></Helmet>
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">
          <div className="admin-header">
            <h1 className="admin-title">🌸 Orders Management</h1>
            <span style={{ color: '#9E7A8C', fontSize: '0.88rem' }}>{orders.length} total orders</span>
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {['all', ...STATUSES].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {s}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-overlay"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">📦</div>
              <div className="empty-state__title">No orders found</div>
              <div className="empty-state__desc">Orders matching this filter will appear here.</div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Offers</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(o => (
                    <tr key={o._id}>
                      <td><code style={{ fontSize: '0.8rem' }}>#{o._id.slice(-8).toUpperCase()}</code></td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{o.user?.name || 'N/A'}</div>
                        <div style={{ fontSize: '0.78rem', color: '#9E7A8C' }}>{o.user?.email}</div>
                      </td>
                      <td>{o.orderItems?.length} item(s)</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          {o.buy2get1Applied && <span title="Buy 2 Get 1" style={{ color: '#C2185B' }}><FiTag /></span>}
                          {o.giftHamperAdded && <span title="Gift Hamper" style={{ color: '#FFB300' }}><FiGift /></span>}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: '#C2185B' }}>₹{o.totalPrice?.toLocaleString()}</td>
                      <td>
                        <select
                          className="form-input form-select"
                          style={{ padding: '0.35rem 2rem 0.35rem 0.6rem', fontSize: '0.78rem', width: 'auto' }}
                          value={o.status}
                          disabled={updating}
                          onChange={e => handleStatusChange(o._id, e.target.value)}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <button className="btn btn-sm btn-outline" onClick={() => setSelected(o)}><FiEye /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Order detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" style={{ maxWidth: '560px', maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #f0d0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem' }}>
                Order #{selected._id.slice(-8).toUpperCase()}
              </h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#9E7A8C' }}><FiX /></button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <span className={`badge ${statusColors[selected.status] || ''}`} style={{ textTransform: 'capitalize' }}>{selected.status}</span>
              </div>

              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#9E7A8C' }}>Customer</h4>
              <p style={{ marginBottom: '1rem' }}>{selected.user?.name} — {selected.user?.email}</p>

              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#9E7A8C' }}>Shipping Address</h4>
              <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                {selected.shippingAddress?.fullName}, {selected.shippingAddress?.street}, {selected.shippingAddress?.city}, {selected.shippingAddress?.state} — {selected.shippingAddress?.pincode}<br />
                📞 {selected.shippingAddress?.phone}
              </p>

              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#9E7A8C' }}>Items</h4>
              <div style={{ marginBottom: '1rem' }}>
                {selected.orderItems?.map((it, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f5e6ee', fontSize: '0.88rem' }}>
                    <span>{it.name} × {it.qty}{it.freeQty > 0 && ` (${it.freeQty} free)`}</span>
                    <span>₹{(it.price * it.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '2px solid #f0d0e0', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.88rem' }}>
                  <span>Items Price</span><span>₹{selected.itemsPrice?.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.88rem', color: '#22c55e' }}>
                  <span>Discount (Buy 2 Get 1)</span><span>-₹{selected.discountAmount?.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.88rem' }}>
                  <span>Shipping</span><span>{selected.shippingPrice ? `₹${selected.shippingPrice}` : 'FREE'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.05rem', color: '#C2185B', marginTop: '0.5rem' }}>
                  <span>Total</span><span>₹{selected.totalPrice?.toLocaleString()}</span>
                </div>
                {selected.giftHamperAdded && (
                  <p style={{ marginTop: '0.75rem', color: '#FFB300', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FiGift /> Free Gift Hamper included
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}