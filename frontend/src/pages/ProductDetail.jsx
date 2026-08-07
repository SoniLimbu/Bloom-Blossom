import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Stars = ({ rating, interactive, onSelect }) => (
  <div className="star-rating">
    {[1,2,3,4,5].map(i => (
      <span
        key={i}
        className={`star-rating__star ${rating >= i ? 'active' : ''}`}
        onClick={() => onSelect && onSelect(i)}
        style={{ cursor: onSelect ? 'pointer' : 'default' }}
      >
        {rating >= i ? <FaStar /> : <FaRegStar />}
      </span>
    ))}
  </div>
);

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    productAPI.getById(id).then(r => setProduct(r.data)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error('Please write a comment');
    setSubmitting(true);
    try {
      await productAPI.createReview(id, { rating, comment });
      toast.success('Review submitted! 🌸');
      setComment('');
      const r = await productAPI.getById(id);
      setProduct(r.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="loading-overlay" style={{ paddingTop: '90px' }}><div className="spinner" /></div>;
  if (!product) return <div style={{ paddingTop: '90px', textAlign: 'center', padding: '5rem' }}>Product not found</div>;

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;
  const images = product.images?.length > 0 ? product.images : ['https://commons.wikimedia.org/wiki/Special:FilePath/Flower%20bouquet.jpg?width=500'];
  const discountPct = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <>
      <Helmet>
        <title>{product.name} — Bloom & Blossom</title>
        <meta name="description" content={product.description} />
      </Helmet>
      <div className="product-detail">
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '2rem', fontSize: '0.88rem', color: '#9E7A8C' }}>
            <Link to="/" style={{ color: '#C2185B' }}>Home</Link> /
            <Link to="/shop" style={{ color: '#C2185B' }}>Shop</Link> /
            <span>{product.name}</span>
          </div>

          <div className="grid-2" style={{ alignItems: 'start' }}>
            {/* Gallery */}
            <div className="product-gallery">
              <div className="product-gallery__main">
                <img src={images[activeImg]} alt={product.name}
                  onError={e => { e.target.src = 'https://commons.wikimedia.org/wiki/Special:FilePath/Flower%20bouquet.jpg?width=500'; }} />
              </div>
              {images.length > 1 && (
                <div className="product-gallery__thumbs">
                  {images.map((img, i) => (
                    <div key={i} className={`product-gallery__thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                      <img src={img} alt="" onError={e => { e.target.src = 'https://commons.wikimedia.org/wiki/Special:FilePath/Flower%20bouquet.jpg?width=500'; }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1, color: '#9E7A8C', marginBottom: '0.5rem' }}>{product.category}</div>
              <h1 className="product-info__name">{product.name}</h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Stars rating={product.rating || 0} />
                <span style={{ color: '#9E7A8C', fontSize: '0.9rem' }}>({product.numReviews} reviews)</span>
              </div>

              <div className="product-info__price-row">
                <span className="product-info__price">₹{displayPrice.toLocaleString()}</span>
                {hasDiscount && <span className="product-info__original">₹{product.price.toLocaleString()}</span>}
                {hasDiscount && <span className="product-info__discount">-{discountPct}% OFF</span>}
              </div>

              {/* Buy 2 Get 1 Offer */}
              <div style={{ background: 'linear-gradient(135deg, rgba(194,24,91,0.06), rgba(233,30,140,0.06))', border: '1px solid rgba(194,24,91,0.2)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 700, color: '#C2185B', marginBottom: '0.25rem' }}>🌹 Buy 2 Get 1 FREE!</div>
                <div style={{ fontSize: '0.85rem', color: '#6B4C5E' }}>Add 2 or more of this flower and get 1 absolutely free. Auto-applied in your cart!</div>
              </div>

              <p style={{ color: '#6B4C5E', lineHeight: 1.8, marginBottom: '1.5rem' }}>{product.description}</p>

              {/* Stock */}
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', color: product.stock > 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: product.stock > 0 ? '#22c55e' : '#ef4444', display: 'inline-block' }}></span>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>

              {/* Qty + Add to Cart */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div className="qty-control">
                  <button className="qty-control__btn" onClick={() => setQty(q => Math.max(1, q - 1))}><FiMinus /></button>
                  <span className="qty-control__num">{qty}</span>
                  <button className="qty-control__btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}><FiPlus /></button>
                </div>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => addToCart(product, qty)}
                  disabled={product.stock === 0}
                  style={{ flex: 1 }}
                >
                  <FiShoppingCart /> Add to Cart
                </button>
              </div>

              {/* Tags */}
              {product.tags?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {product.tags.map(t => (
                    <span key={t} style={{ background: '#F8BBD9', color: '#C2185B', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 500 }}>#{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* REVIEWS */}
          <div style={{ marginTop: '4rem' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', marginBottom: '2rem' }}>Customer Reviews</h2>
            <div className="grid-2" style={{ alignItems: 'start' }}>
              {/* Review List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {product.reviews?.length === 0 ? (
                  <div style={{ color: '#9E7A8C', padding: '2rem', textAlign: 'center', background: 'white', borderRadius: '16px' }}>
                    No reviews yet. Be the first to review! 🌸
                  </div>
                ) : (
                  product.reviews.map(r => (
                    <div key={r._id} className="review-card">
                      <div className="review-card__header">
                        <div className="review-card__avatar">{r.name.charAt(0)}</div>
                        <div>
                          <div className="review-card__name">{r.name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Stars rating={r.rating} />
                            <span className="review-card__date">{new Date(r.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <p className="review-card__comment">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Write Review */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '1.75rem', boxShadow: 'var(--shadow)' }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.5rem' }}>Write a Review</h3>
                {!user ? (
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <p style={{ color: '#9E7A8C', marginBottom: '1rem' }}>Please login to leave a review</p>
                    <Link to="/login" className="btn btn-primary">Login</Link>
                  </div>
                ) : (
                  <form onSubmit={handleReview}>
                    <div className="form-group">
                      <label className="form-label">Your Rating</label>
                      <Stars rating={rating} interactive onSelect={setRating} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Your Review</label>
                      <textarea
                        className="form-input form-textarea"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Share your experience with this flower..."
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                      {submitting ? 'Submitting...' : 'Submit Review 🌸'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}