import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { userAPI } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import toast from 'react-hot-toast';
import { FiTrash2, FiMail, FiPhone } from 'react-icons/fi';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetch = () => {
    setLoading(true);
    userAPI.getAll().then(r => setUsers(r.data)).catch(() => toast.error('Failed to load users')).finally(() => setLoading(false));
  };
  useEffect(fetch, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove customer "${name}"? This cannot be undone.`)) return;
    try {
      await userAPI.deleteUser(id);
      toast.success('Customer removed');
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const customerCount = users.filter(u => u.role === 'customer').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  return (
    <>
      <Helmet><title>Customers — Admin</title></Helmet>
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">
          <div className="admin-header">
            <h1 className="admin-title">🌸 Customers</h1>
            <span style={{ color: '#9E7A8C', fontSize: '0.88rem' }}>{customerCount} customers · {adminCount} admins</span>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <input
              className="form-input"
              style={{ maxWidth: '350px' }}
              placeholder="🔍 Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="loading-overlay"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">👥</div>
              <div className="empty-state__title">No users found</div>
              <div className="empty-state__desc">Registered customers will appear here.</div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 500 }}>{u.name}</td>
                      <td style={{ fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><FiMail size={13} /> {u.email}</div>
                        {u.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem', color: '#9E7A8C' }}><FiPhone size={13} /> {u.phone}</div>}
                      </td>
                      <td><span className={`badge ${u.role === 'admin' ? 'badge--admin' : 'badge--customer'}`} style={{ textTransform: 'capitalize' }}>{u.role}</span></td>
                      <td style={{ fontSize: '0.82rem' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          disabled={u.role === 'admin'}
                          style={u.role === 'admin' ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                          onClick={() => handleDelete(u._id, u.name)}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </>
  );
}