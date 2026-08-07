import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { offerAPI } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const TYPES = [
  { value: 'buy2get1', label: 'Buy 2 Get 1 Free' },
  { value: 'giftHamper', label: 'Gift Hamper Reward' },
  { value: 'percentDiscount', label: 'Percentage Discount' },
  { value: 'flatDiscount', label: 'Flat Discount' },
];

const emptyForm = {
  title: '', description: '', type: 'buy2get1',
  discountPercent: '', discountFlat: '', minCartValue: '', minQty: 2, freeQty: 1,
  isActive: true,
};

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    setLoading(true);
    offerAPI.getAll().then(r => setOffers(r.data)).catch(() => toast.error('Failed to load offers')).finally(() => setLoading(false));
  };
  useEffect(fetch, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (o) => {
    setEditing(o);
    setForm({
      title: o.title, description: o.description || '', type: o.type,
      discountPercent: o.discountPercent || '', discountFlat: o.discountFlat || '',
      minCartValue: o.minCartValue || '', minQty: o.minQty || 2, freeQty: o.freeQty || 1,
      isActive: o.isActive,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        discountPercent: Number(form.discountPercent) || 0,
        discountFlat: Number(form.discountFlat) || 0,
        minCartValue: Number(form.minCartValue) || 0,
        minQty: Number(form.minQty) || 2,
        freeQty: Number(form.freeQty) || 1,
      };
      if (editing) await offerAPI.update(editing._id, payload);
      else await offerAPI.create(payload);
      toast.success(editing ? 'Offer updated!' : 'Offer created! 🎁');
      setShowModal(false);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete offer "${title}"?`)) return;
    try {
      await offerAPI.delete(id);
      toast.success('Offer deleted');
      setOffers(prev => prev.filter(o => o._id !== id));
    } catch {
      toast.error('Delete failed');
    }
  };

  const toggleActive = async (o) => {
    try {
      const { data } = await offerAPI.update(o._id, { isActive: !o.isActive });
      setOffers(prev => prev.map(x => (x._id === o._id ? data : x)));
    } catch {
      toast.error('Failed to toggle offer');
    }
  };

  return (
    <>
      <Helmet><title>Offers — Admin</title></Helmet>
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">
          <div className="admin-header">
            <h1 className="admin-title">🌸 Offers Management</h1>
            <button className="btn btn-primary" onClick={openAdd}><FiPlus /> New Offer</button>
          </div>

          {loading ? (
            <div className="loading-overlay"><div className="spinner" /></div>
          ) : offers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">🎁</div>
              <div className="empty-state__title">No offers yet</div>
              <div className="empty-state__desc">Create promotional offers like Buy 2 Get 1 or Gift Hampers.</div>
              <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Create Offer</button>
            </div>
          ) : (
            <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {offers.map(o => (
                <div key={o._id} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', flex: 1 }}>{o.title}</h3>
                    <span className={`badge ${o.isActive ? 'badge--delivered' : 'badge--cancelled'}`}>{o.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#9E7A8C', marginBottom: '0.75rem', minHeight: '2.5em' }}>{o.description}</p>
                  <div style={{ fontSize: '0.8rem', color: '#9E7A8C', marginBottom: '1rem' }}>
                    <span style={{ textTransform: 'capitalize' }}>{TYPES.find(t => t.value === o.type)?.label || o.type}</span>
                    {o.minCartValue > 0 && <div>Min cart: ₹{o.minCartValue.toLocaleString()}</div>}
                    {o.type === 'buy2get1' && <div>Buy {o.minQty} get {o.freeQty} free</div>}
                    {o.discountPercent > 0 && <div>{o.discountPercent}% off</div>}
                    {o.discountFlat > 0 && <div>₹{o.discountFlat} off</div>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-sm btn-outline" onClick={() => toggleActive(o)}>{o.isActive ? 'Deactivate' : 'Activate'}</button>
                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(o)}><FiEdit2 /></button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(o._id, o.title)}><FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #f0d0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem' }}>{editing ? 'Edit Offer' : 'Create Offer'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#9E7A8C' }}><FiX /></button>
            </div>
            <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input form-textarea" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Offer Type *</label>
                <select className="form-input form-select" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              {form.type === 'buy2get1' && (
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Min Quantity</label>
                    <input type="number" className="form-input" min="1" value={form.minQty} onChange={e => setForm(p => ({ ...p, minQty: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Free Quantity</label>
                    <input type="number" className="form-input" min="1" value={form.freeQty} onChange={e => setForm(p => ({ ...p, freeQty: e.target.value }))} />
                  </div>
                </div>
              )}

              {form.type === 'giftHamper' && (
                <div className="form-group">
                  <label className="form-label">Minimum Cart Value (₹) *</label>
                  <input type="number" className="form-input" min="0" value={form.minCartValue} onChange={e => setForm(p => ({ ...p, minCartValue: e.target.value }))} placeholder="e.g. 10000" />
                </div>
              )}

              {form.type === 'percentDiscount' && (
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Discount %</label>
                    <input type="number" className="form-input" min="0" max="100" value={form.discountPercent} onChange={e => setForm(p => ({ ...p, discountPercent: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Min Cart Value (₹)</label>
                    <input type="number" className="form-input" min="0" value={form.minCartValue} onChange={e => setForm(p => ({ ...p, minCartValue: e.target.value }))} />
                  </div>
                </div>
              )}

              {form.type === 'flatDiscount' && (
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Flat Discount (₹)</label>
                    <input type="number" className="form-input" min="0" value={form.discountFlat} onChange={e => setForm(p => ({ ...p, discountFlat: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Min Cart Value (₹)</label>
                    <input type="number" className="form-input" min="0" value={form.minCartValue} onChange={e => setForm(p => ({ ...p, minCartValue: e.target.value }))} />
                  </div>
                </div>
              )}

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} style={{ accentColor: '#C2185B' }} />
                Active
              </label>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Offer' : 'Create Offer 🎁'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}