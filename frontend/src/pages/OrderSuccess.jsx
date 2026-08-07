import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { orderAPI } from '../services/api';
import { FiCheckCircle } from 'react-icons/fi';

const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getById(id).then(r => setOrder(r.data)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-overlay" style={{ paddingTop: '90px' }}><div className="spinner" /></div>;
  if (!order) return null;

  const statusIdx = statusSteps.indexOf(order.status);

  return (
    <>
      <Helmet><title>Order Confirmed — Bloom & Blossom</title></Helmet>
      <div style={{ paddingTop: '110px', minHeight: '100vh', paddingBottom: '5rem' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          {/* Success Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2.5rem', color: 'white', boxShadow: '0 8px 30px rgba(34,197,94,0.3)' }}>✓</div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', marginBottom: '0.75rem' }}>Order Confirmed! 🌸</h1>
            <p style={{ color: '#6B4C5E', marginBottom: '0.5rem' }}>Thank you for your order! We'll start preparing your flowers right away.</p>
            <code style={{ background: '#f0d0e0', color: '#C2185B', padding: '0.25rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>Order #{order._id.slice(-8).toUpperCase()}</code>
          </div>

          {/* Gift Hamper Alert */}
          {order.giftHamperAdded && (
            <div style={{ background: 'linear-gradient(135deg, #FFF8E1, #FFF3CD)', border: '2px solid #FFB300', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎁</div>
              <h3 style={{ color: '#FF6F00', marginBottom: '0.5rem' }}>Your FREE Gift Hamper is included!</h3>
              <p style={{ color: '#6B4C5E', fontSize: '0.9rem' }}>Our Premium Gift Hamper (worth ₹1,499) has been added to your order completely free!</p>
            </div>
          )}

          {/* Order Tracking */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: 'var(--shadow)', marginBottom: '2rem' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '2rem' }}>Order Status</h3>
            <div className="order-timeline">
              {statusSteps.map((step, i) => (
                <div key={step} className={`timeline-step ${i <= statusIdx ? 'done' : ''} ${i === statusIdx ? 'current' : ''}`}>
                  <div className="timeline-dot">{i < statusIdx ? '✓' : i + 1}</div>
                  <div className="timeline-label" style={{ textTransform: 'capitalize' }}>{step}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: 'var(--shadow)', marginBottom: '2rem' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.5rem' }}>Order Details</h3>
            {order.orderItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid #f0d0e0' }}>
                <span style={{ fontSize: '0.9rem' }}>{item.name} × {item.qty}{item.freeQty > 0 ? ` (+${item.freeQty} free)` : ''}</span>
                <span style={{ fontWeight: 600, color: '#C2185B' }}>₹{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', fontSize: '1.1rem', fontWeight: 700 }}>
              <span>Total Paid</span>
              <span style={{ color: '#C2185B' }}>₹{order.totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/dashboard" className="btn btn-outline">View My Orders</Link>
            <Link to="/shop" className="btn btn-primary">Continue Shopping 🌸</Link>
          </div>
        </div>
      </div>
    </>
  );
}
