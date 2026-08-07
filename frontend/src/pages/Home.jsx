import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { productAPI, offerAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import { MdLocalOffer } from 'react-icons/md';

const categories = [
  { name: 'Roses', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/BEAUTIFUL%20RED%20ROSES.jpg?width=200', cat: 'roses' },
  { name: 'Lilies', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pink%20Lily%20Lilium%20sp%20Flower%20Closeup%202511px.jpg?width=200', cat: 'lilies' },
  { name: 'Orchids', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Purple%20Orchid%20Flower.jpg?width=200', cat: 'orchids' },
  { name: 'Sunflowers', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/A%20Sunflower.jpg?width=200', cat: 'sunflowers' },
  { name: 'Bouquets', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Flower%20bouquet.jpg?width=200', cat: 'bouquets' },
  { name: 'Hampers', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bouquet%20de%20roses%20roses.jpg?width=200', cat: 'hamper' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([productAPI.getFeatured(), offerAPI.getActive()])
      .then(([pr, or]) => { setFeatured(pr.data); setOffers(or.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Bloom & Blossom — Premium Flower Shop</title>
        <meta name="description" content="Shop the finest fresh flowers, bouquets, and gift hampers. Buy 2 get 1 free! Free gift hamper on orders over ₹10,000." />
      </Helmet>

      {/* Offer Ticker */}
      <div className="offer-banner" style={{ marginTop: '70px' }}>
        <div className="ticker-wrap">
          <div className="ticker-move">
            {[...Array(2)].map((_, ri) => (
              <div key={ri} className="offer-ticker" style={{ display: 'flex', gap: '3rem', padding: '0 1.5rem' }}>
                <span className="offer-ticker__item">🌹 Buy 2 Get 1 FREE on all flowers!</span>
                <span className="offer-ticker__item">🎁 FREE Gift Hamper on orders ₹10,000+</span>
                <span className="offer-ticker__item">🚚 Free Delivery on orders ₹2,000+</span>
                <span className="offer-ticker__item">⭐ Premium Quality, Fresh Daily</span>
                <span className="offer-ticker__item">💝 Same Day Delivery Available</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>
          <div className="hero__content">
            <div className="hero__tag">
              <MdLocalOffer /> 🌸 Fresh Flowers, Daily Delivery
            </div>
            <h1 className="heading-hero hero__title">
              Where Every<br />
              <span className="text-gradient">Petal Tells</span><br />
              a Story
            </h1>
            <p className="hero__subtitle">
              Handcrafted bouquets & premium blooms delivered fresh to your door. Celebrate life's moments with nature's finest.
            </p>
            <div className="hero__actions">
              <Link to="/shop" className="btn btn-primary btn-lg">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/shop?category=bouquets" className="btn btn-outline btn-lg">
                View Bouquets
              </Link>
            </div>
            <div className="hero__stats">
              <div className="hero__stat">
                <div className="hero__stat-number">500+</div>
                <div className="hero__stat-label">Flower Varieties</div>
              </div>
              <div className="hero__stat">
                <div className="hero__stat-number">10K+</div>
                <div className="hero__stat-label">Happy Customers</div>
              </div>
              <div className="hero__stat">
                <div className="hero__stat-number">4.9★</div>
                <div className="hero__stat-label">Average Rating</div>
              </div>
            </div>
          </div>
          <div className="hero__image">
            <div className="hero__img-wrapper">
              <img
                src="https://images.unsplash.com/photo-1490750967868-88df5691cc08?w=500&q=80"
                alt="Beautiful flower bouquet"
                className="hero__img-main"
                onError={e => { e.target.src = 'https://commons.wikimedia.org/wiki/Special:FilePath/Flower%20bouquet.jpg?width=500'; }}
              />
              <img
                src="https://images.unsplash.com/photo-1548460642-be1b29b50f39?w=200&q=80"
                alt="Pink roses"
                className="hero__img-float"
                style={{ bottom: '10%', left: 0 }}
                onError={e => { e.target.src = 'https://commons.wikimedia.org/wiki/Special:FilePath/BEAUTIFUL%20RED%20ROSES.jpg?width=300'; }}
              />
              <img
                src="https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=200&q=80"
                alt="Lilies"
                className="hero__img-float"
                style={{ top: '10%', right: 0 }}
                onError={e => { e.target.src = 'https://commons.wikimedia.org/wiki/Special:FilePath/Pink%20Lily%20Lilium%20sp%20Flower%20Closeup%202511px.jpg?width=300'; }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag">Browse by Type</span>
            <h2 className="heading-section section-header__title">Explore Our <span className="text-gradient">Collections</span></h2>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map(c => (
              <Link
                key={c.cat}
                to={`/shop?category=${c.cat}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
                  padding: '1.5rem 2rem', borderRadius: '16px', background: 'linear-gradient(135deg, #FFF8F0, #F8BBD9)',
                  border: '2px solid #f0d0e0', transition: 'all 0.3s ease', minWidth: '120px',
                  textDecoration: 'none', color: '#1a0a14',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#C2185B'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#f0d0e0'; }}
              >
                <span
                  style={{
                    width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden',
                    border: '2px solid white', boxShadow: '0 2px 8px rgba(194,24,91,0.2)', flexShrink: 0,
                  }}
                >
                  <img
                    src={c.img}
                    alt={c.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.src = 'https://commons.wikimedia.org/wiki/Special:FilePath/Flower%20bouquet.jpg?width=200'; }}
                  />
                </span>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* OFFERS */}
      <section className="section" id="offers" style={{ background: 'linear-gradient(135deg, #FFF8F0, #FCE4EC)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag">Special Deals</span>
            <h2 className="heading-section section-header__title">Today's <span className="text-gradient">Offers</span></h2>
          </div>
          <div className="grid-3">
            {/* Buy 2 Get 1 */}
            <div style={{ background: 'linear-gradient(135deg, #C2185B, #E91E8C)', borderRadius: '20px', padding: '2.5rem', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌹🌹🌹</div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Buy 2 Get 1 FREE</h3>
              <p style={{ opacity: 0.9, marginBottom: '1.5rem', lineHeight: 1.7 }}>Add any 2 of the same flower to your cart and get 1 absolutely FREE! Auto-applied at checkout.</p>
              <Link to="/shop" className="btn" style={{ background: 'white', color: '#C2185B', fontWeight: 700 }}>Shop Now</Link>
            </div>
            {/* Gift Hamper */}
            <div style={{ background: 'linear-gradient(135deg, #FF6F00, #FFB300)', borderRadius: '20px', padding: '2.5rem', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎁</div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '0.75rem' }}>FREE Gift Hamper</h3>
              <p style={{ opacity: 0.9, marginBottom: '1.5rem', lineHeight: 1.7 }}>Shop flowers worth ₹10,000 or more and receive our exclusive Premium Gift Hamper FREE!</p>
              <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '0.5rem', marginBottom: '1rem', fontWeight: 700, fontSize: '1.1rem' }}>₹10,000+ = 🎁 FREE Hamper</div>
              <Link to="/shop" className="btn" style={{ background: 'white', color: '#FF6F00', fontWeight: 700 }}>Shop Now</Link>
            </div>
            {/* Free Shipping */}
            <div style={{ background: 'linear-gradient(135deg, #1a0a14, #3d1a30)', borderRadius: '20px', padding: '2.5rem', color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚚</div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Free Delivery</h3>
              <p style={{ opacity: 0.7, marginBottom: '1.5rem', lineHeight: 1.7 }}>Get free delivery on all orders above ₹2,000. Fresh flowers delivered straight to your door!</p>
              <div style={{ background: 'rgba(194,24,91,0.3)', borderRadius: '10px', padding: '0.5rem', marginBottom: '1rem', fontWeight: 700, fontSize: '1.1rem' }}>Orders ₹2,000+ = Free Delivery</div>
              <Link to="/shop" className="btn btn-primary">Shop Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag">Best Sellers</span>
            <h2 className="heading-section section-header__title">Featured <span className="text-gradient">Flowers</span></h2>
            <p className="section-header__desc">Hand-picked by our florists — the finest and most loved arrangements</p>
          </div>
          {loading ? (
            <div className="loading-overlay"><div className="spinner" /><p>Loading flowers...</p></div>
          ) : (
            <div className="grid-4">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/shop" className="btn btn-primary btn-lg">View All Flowers <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag">Why Choose Us</span>
            <h2 className="heading-section section-header__title">The Bloom & Blossom <span className="text-gradient">Promise</span></h2>
          </div>
          <div className="grid-4">
            {[
              { icon: '🌱', title: 'Farm Fresh', desc: 'Flowers sourced directly from local farms, ensuring maximum freshness and longer vase life.' },
              { icon: '🚀', title: 'Same Day Delivery', desc: 'Order before 2 PM and receive your flowers the same day, fresh and beautiful.' },
              { icon: '🎨', title: 'Custom Arrangements', desc: 'Our expert florists can create custom bouquets tailored to your special occasion.' },
              { icon: '💯', title: '100% Satisfaction', desc: 'Not happy? We\'ll replace your order or give a full refund. No questions asked.' },
            ].map((f, i) => (
              <div key={i} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: '0.75rem' }}>{f.title}</h3>
                <p style={{ color: '#6B4C5E', fontSize: '0.88rem', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--gradient)', padding: '5rem 0', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌸</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', marginBottom: '1rem' }}>Ready to Send Some Love?</h2>
          <p style={{ opacity: 0.9, fontSize: '1.05rem', marginBottom: '2.5rem' }}>Browse our collection and find the perfect flowers for every occasion</p>
          <Link to="/shop" className="btn btn-lg" style={{ background: 'white', color: '#C2185B', fontWeight: 700, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
            Start Shopping <FiArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}