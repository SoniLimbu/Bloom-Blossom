import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function GiftHamperModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
        <button className="modal__close-btn" onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '1.1rem', zIndex: 10 }}>✕</button>
        <div className="modal__header" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
          <span className="modal__icon">🎁</span>
          <h2 className="modal__title">You've Unlocked a Gift Hamper!</h2>
          <p style={{ opacity: 0.9, marginTop: '0.5rem', fontSize: '0.95rem' }}>Congratulations! Your cart is over ₹10,000</p>
        </div>
        <div className="modal__body">
          <div style={{ fontSize: '3rem', textAlign: 'center', margin: '0.5rem 0 1rem' }}>🌸🍫🕯️🎀</div>
          <p className="modal__desc">
            You've earned our <strong>Premium Gift Hamper</strong> — a beautifully curated collection including premium chocolates, scented candles, a personal greeting card, and exclusive flower seeds! This will be included in your order <strong>absolutely FREE</strong>.
          </p>
          <div style={{ background: 'linear-gradient(135deg, #FFF8E1, #FFF3CD)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', border: '1px solid #FFB300', textAlign: 'center' }}>
            <strong style={{ color: '#FF6F00', fontSize: '1.1rem' }}>🎉 Gift Hamper Added to Your Order!</strong>
            <br />
            <small style={{ color: '#6B4C5E' }}>Value: ₹1,499 — Yours FREE!</small>
          </div>
          <div className="modal__actions" style={{ justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={onClose}>Continue Shopping</button>
            <Link to="/checkout" className="btn btn-primary" onClick={onClose}>Proceed to Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
