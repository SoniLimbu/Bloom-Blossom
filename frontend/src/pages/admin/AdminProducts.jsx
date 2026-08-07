import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { productAPI } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';

const CATS = ['roses', 'lilies', 'orchids', 'sunflowers', 'tulips', 'mixed', 'bouquets', 'plants', 'hamper'];

const emptyForm = { name: '', description: '', price: '', discountPrice: '', category: 'roses', stock: '', isFeatured: false, isAvailable: true, tags: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const fileRef = useRef();

  const fetch = () => {
    setLoading(true);
    productAPI.getAdminAll().then(r => setProducts(r.data)).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(fetch, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setFiles([]); setShowModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ name: p.name, description: p.description, price: p.price, discountPrice: p.discountPrice || '', category: p.category, stock: p.stock, isFeatured: p.isFeatured, isAvailable: p.isAvailable, tags: (p.tags || []).join(', ') }); setFiles([]); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach(f => fd.append('images', f));
      if (editing) await productAPI.update(editing._id, fd);
      else await productAPI.create(fd);
      toast.success(editing ? 'Product updated!' : 'Product added! 🌸');
      setShowModal(false);
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await productAPI.delete(id);
      toast.success('Product deleted');
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch { toast.error('Delete failed'); }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Helmet><title>Products — Admin</title></Helmet>
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">
          <div className="admin-header">
            <h1 className="admin-title">🌸 Products Management</h1>
            <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Add Product</button>
          </div>

          {/* Search */}
          <div style={{ marginBottom: '1.5rem' }}>
            <input className="form-input" style={{ maxWidth: '350px' }} placeholder="🔍 Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {loading ? <div className="loading-overlay"><div className="spinner" /></div> : (
            <div className="table-wrapper">
              <table className="table">
                <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr></thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p._id}>
                      <td><img src={p.images?.[0] || 'https://commons.wikimedia.org/wiki/Special:FilePath/Flower%20bouquet.jpg?width=500'} alt={p.name} className="table-img" onError={e => { e.target.src = 'https://commons.wikimedia.org/wiki/Special:FilePath/Flower%20bouquet.jpg?width=500'; }} /></td>
                      <td style={{ fontWeight: 500 }}>{p.name}</td>
                      <td style={{ textTransform: 'capitalize' }}>{p.category}</td>
                      <td>
                        <div style={{ color: '#C2185B', fontWeight: 600 }}>₹{(p.discountPrice || p.price).toLocaleString()}</div>
                        {p.discountPrice > 0 && <div style={{ fontSize: '0.78rem', textDecoration: 'line-through', color: '#9E7A8C' }}>₹{p.price.toLocaleString()}</div>}
                      </td>
                      <td>
                        <span style={{ color: p.stock < 5 ? '#ef4444' : '#22c55e', fontWeight: 600 }}>{p.stock}</span>
                      </td>
                      <td><span style={{ color: p.isFeatured ? '#22c55e' : '#9E7A8C' }}>{p.isFeatured ? '⭐ Yes' : 'No'}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-sm btn-outline" onClick={() => openEdit(p)}><FiEdit2 /></button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id, p.name)}><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #f0d0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem' }}>{editing ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#9E7A8C' }}><FiX /></button>
            </div>
            <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-input form-select" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                    {CATS.map(c => <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-input form-textarea" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input type="number" className="form-input" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required min="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Discount Price (₹)</label>
                  <input type="number" className="form-input" value={form.discountPrice} onChange={e => setForm(p => ({ ...p, discountPrice: e.target.value }))} placeholder="Leave 0 for no discount" min="0" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input type="number" className="form-input" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} required min="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Tags (comma separated)</label>
                  <input className="form-input" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="love, gift, premium" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(p => ({ ...p, isFeatured: e.target.checked }))} style={{ accentColor: '#C2185B' }} />
                  Featured Product
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="checkbox" checked={form.isAvailable} onChange={e => setForm(p => ({ ...p, isAvailable: e.target.checked }))} style={{ accentColor: '#C2185B' }} />
                  Available
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">Product Images</label>
                <div style={{ border: '2px dashed #f0d0e0', borderRadius: '10px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer' }} onClick={() => fileRef.current.click()}>
                  <FiUpload style={{ fontSize: '1.5rem', color: '#C2185B', marginBottom: '0.5rem' }} />
                  <p style={{ color: '#9E7A8C', fontSize: '0.88rem' }}>{files.length > 0 ? `${files.length} file(s) selected` : 'Click to upload images (max 5)'}</p>
                </div>
                <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => setFiles(Array.from(e.target.files))} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product 🌸'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}