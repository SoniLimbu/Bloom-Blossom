import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import GiftHamperModal from '../components/GiftHamperModal';

export default function Cart() {
  const {
    cartItems, removeFromCart, updateQty, clearCart,
    itemsPrice, freeDiscount, buy2get1Applied, giftHamperUnlocked,
    shippingPrice, totalPrice, getItemFreeQty, GIFT_HAMPER_THRESHOLD
  } = useCart();
  const [showHamperModal, setShowHamperModal] = useState(false);

  useEffect(() => {
    if (giftHamperUnlocked) {
      const shown = sessionStorage.getItem('hamperShown');
      if (!shown) { setShowHamperModal(true); sessionStorage.setItem('hamperShown', '1'); }
    }
  }, [giftHamperUnlocked]);

  if (cartItems.length === 0) {
    return (
      <>
        <Helmet><title>Cart — Bloom & Blossom</title></Helmet>
        <div className="cart-page">
          <div className="container">
            <div className="empty-state" style={{ paddingTop: '4rem' }}>
              <div className="empty-state__icon">🛒</div>
              <h2 className="empty-state__title">Your Cart is Empty</h2>
              <p className="empty-state__desc">Add some beautiful flowers to your cart!</p>
              <Link to="/shop" className="btn btn-primary btn-lg">Browse Flowers 🌸</Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const amountToHamper = GIFT_HAMPER_THRESHOLD - itemsPrice;

  return (
    <>
      <Helmet><title>Cart ({cartItems.length}) — Bloom & Blossom</title></Helmet>
      {showHamperModal && <GiftHamperModal onClose={() => setShowHamperModal(false)} />}

      <div className="cart-page">
        <div className="container">
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', marginBottom: '2rem' }}>
            🛒 Shopping Cart <span style={{ color: '#9E7A8C', fontSize: '1rem', fontFamily: 'Poppins, sans-serif' }}>({cartItems.length} items)</span>
          </h1>

          {/* Offer Chips */}
          {buy2get1Applied && (
            <div className="offer-chip">
              ✅ Buy 2 Get 1 FREE applied — You're saving ₹{freeDiscount.toLocaleString()} on free items!
            </div>
          )}
          {giftHamperUnlocked ? (
            <div className="gift-hamper-alert">
              <span style={{ fontSize: '1.75rem' }}>🎁</span>
              <div>
                <strong style={{ color: '#FF6F00' }}>🎉 Gift Hamper Unlocked!</strong>
                <p style={{ fontSize: '0.85rem', margin: 0, color: '#6B4C5E' }}>Your FREE Premium Gift Hamper has been added to your order!</p>
              </div>
            </div>
          ) : amountToHamper > 0 && (
            <div style={{ background: 'rgba(255,179,0,0.08)', border: '1px dashed #FFB300', borderRadius: '12px', padding: '0.85rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🎁</span>
              <span style={{ fontSize: '0.88rem', color: '#6B4C5E' }}>
                Add <strong style={{ color: '#FF6F00' }}>₹{amountToHamper.toLocaleString()}</strong> more to unlock a FREE Gift Hamper!
              </span>
              {/* Progress bar */}
              <div style={{ flex: 1, height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(100, (itemsPrice / GIFT_HAMPER_THRESHOLD) * 100)}%`, background: 'linear-gradient(90deg, #FFB300, #FF6F00)', borderRadius: '3px', transition: 'width 0.5s ease' }} />
              </div>
            </div>
          )}

          <div className="grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
            {/* Cart Items */}
            <div>
              {cartItems.map(item => {
                const freeQty = getItemFreeQty(item);
                const price = item.discountPrice > 0 ? item.discountPrice : item.price;
                return (
                  <div key={item._id} className="cart-item">
                    <img
                      src={item.images?.[0] || 'https://commons.wikimedia.org/wiki/Special:FilePath/Flower%20bouquet.jpg?width=500'}
                      alt={item.name}
                      className="cart-item__img"
                      onError={e => { e.target.src = 'https://commons.wikimedia.org/wiki/Special:FilePath/Flower%20bouquet.jpg?width=500'; }}
                    />
                    <div className="cart-item__info">
                      <h3 className="cart-item__name">{item.name}</h3>
                      <div className="cart-item__price">₹{price.toLocaleString()} each</div>
                      {freeQty > 0 && (
                        <div className="cart-item__free">🎁 {freeQty} FREE (Buy 2 Get 1)</div>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                      <div className="qty-control">
                        <button className="qty-control__btn" onClick={() => updateQty(item._id, item.qty - 1)}><FiMinus /></button>
                        <span className="qty-control__num">{item.qty}</span>
                        <button className="qty-control__btn" onClick={() => updateQty(item._id, item.qty + 1)}><FiPlus /></button>
                      </div>
                      <div style={{ fontWeight: 700, color: '#C2185B' }}>₹{(price * item.qty).toLocaleString()}</div>
                      <button onClick={() => removeFromCart(item._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                );
              })}
              <button onClick={clearCart} className="btn btn-ghost" style={{ marginTop: '0.5rem', color: '#ef4444' }}>
                <FiTrash2 /> Clear Cart
              </button>
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <h3 className="cart-summary__title">Order Summary</h3>
              <div className="cart-summary__row"><span>Subtotal</span><span>₹{itemsPrice.toLocaleString()}</span></div>
              {buy2get1Applied && <div className="cart-summary__row cart-summary__row--discount"><span>🎁 Buy 2 Get 1 Free Discount</span><span>-₹{freeDiscount.toLocaleString()}</span></div>}
              {giftHamperUnlocked && <div className="cart-summary__row cart-summary__row--discount"><span>🎁 FREE Gift Hamper</span><span>-₹1,499</span></div>}
              <div className="cart-summary__row"><span>Shipping</span><span>{shippingPrice === 0 ? <span style={{ color: '#22c55e', fontWeight: 600 }}>FREE</span> : `₹${shippingPrice}`}</span></div>
              <div className="cart-summary__row cart-summary__row--total"><span>Total</span><span>₹{totalPrice.toLocaleString()}</span></div>
              <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}>
                <FiShoppingBag /> Proceed to Checkout
              </Link>
              <Link to="/shop" className="btn btn-ghost" style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'center' }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}