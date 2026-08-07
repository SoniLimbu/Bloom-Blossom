import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cartItems, itemsPrice, freeDiscount, shippingPrice, totalPrice, giftHamperUnlocked, buy2get1Applied, clearCart, getItemFreeQty } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '' });
  const [payMethod, setPayMethod] = useState('COD');

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return toast.error('Cart is empty');
    setLoading(true);
    try {
      const orderItems = cartItems.map(item => ({
        product: item._id, name: item.name,
        image: item.images?.[0] || '',
        price: item.discountPrice > 0 ? item.discountPrice : item.price,
        qty: item.qty, freeQty: getItemFreeQty(item),
      }));
      const res = await orderAPI.create({ orderItems, shippingAddress: form, paymentMethod: payMethod });
      clearCart();
      sessionStorage.removeItem('hamperShown');
      toast.success('Order placed successfully! 🌸');
      navigate(`/order-success/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>Checkout — Bloom & Blossom</title></Helmet>
      <div style={{ paddingTop: '90px', minHeight: '100vh', paddingBottom: '5rem' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', marginBottom: '2rem' }}>🏠 Checkout</h1>
          <form onSubmit={handleSubmit}>
            <div className="grid-2" style={{ alignItems: 'start', gap: '2rem' }}>
              {/* Shipping Form */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: 'var(--shadow)' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.5rem' }}>Delivery Details</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input name="fullName" className="form-input" value={form.fullName} onChange={handleChange} required placeholder="Your full name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input name="phone" className="form-input" value={form.phone} onChange={handleChange} required placeholder="98XXXXXXXX" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Street Address *</label>
                  <input name="street" className="form-input" value={form.street} onChange={handleChange} required placeholder="House no., Street, Area" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input name="city" className="form-input" value={form.city} onChange={handleChange} required placeholder="Kathmandu" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input name="state" className="form-input" value={form.state} onChange={handleChange} placeholder="Bagmati" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">PIN Code *</label>
                  <input name="pincode" className="form-input" value={form.pincode} onChange={handleChange} required placeholder="44600" />
                </div>

                {/* Payment */}
                <h3 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1rem', marginTop: '1rem' }}>Payment Method</h3>
                {['COD', 'Online', 'Card'].map(m => (
                  <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', border: `2px solid ${payMethod === m ? '#C2185B' : '#f0d0e0'}`, borderRadius: '10px', marginBottom: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <input type="radio" name="payment" value={m} checked={payMethod === m} onChange={() => setPayMethod(m)} style={{ accentColor: '#C2185B' }} />
                    <span style={{ fontWeight: 500 }}>
                      {m === 'COD' ? '💵 Cash on Delivery' : m === 'Online' ? '📱 Online Payment (eSewa/Khalti)' : '💳 Debit/Credit Card'}
                    </span>
                  </label>
                ))}
              </div>

              {/* Order Summary */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: 'var(--shadow)', position: 'sticky', top: '90px' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.5rem' }}>Order Summary</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem' }}>
                  {cartItems.map(item => {
                    const price = item.discountPrice > 0 ? item.discountPrice : item.price;
                    const freeQty = getItemFreeQty(item);
                    return (
                      <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid #f0d0e0', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#9E7A8C' }}>Qty: {item.qty}{freeQty > 0 ? ` (+${freeQty} free)` : ''}</div>
                        </div>
                        <div style={{ fontWeight: 600, color: '#C2185B' }}>₹{(price * item.qty).toLocaleString()}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ borderTop: '1px solid #f0d0e0', paddingTop: '1rem' }}>
                  {[
                    ['Subtotal', `₹${itemsPrice.toLocaleString()}`],
                    buy2get1Applied && ['🎁 Buy 2 Get 1 Discount', `-₹${freeDiscount.toLocaleString()}`],
                    giftHamperUnlocked && ['🎁 FREE Gift Hamper', '-₹1,499'],
                    ['Shipping', shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`],
                  ].filter(Boolean).map(([label, val], i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.9rem', color: label.includes('Discount') || label.includes('Hamper') ? '#22c55e' : '#6B4C5E' }}>
                      <span>{label}</span><span style={{ fontWeight: 600 }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0 0', borderTop: '2px solid #f0d0e0', fontSize: '1.1rem', fontWeight: 700, color: '#1a0a14' }}>
                    <span>Total</span><span style={{ color: '#C2185B' }}>₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
                {giftHamperUnlocked && (
                  <div style={{ background: 'linear-gradient(135deg, #FFF8E1, #FFF3CD)', border: '1px solid #FFB300', borderRadius: '10px', padding: '0.85rem', marginTop: '1rem', textAlign: 'center', fontSize: '0.88rem', color: '#FF6F00', fontWeight: 600 }}>
                    🎁 Premium Gift Hamper included FREE!
                  </div>
                )}
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }} disabled={loading}>
                  {loading ? '⌛ Placing Order...' : '✅ Place Order'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
