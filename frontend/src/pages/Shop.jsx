import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { FiSearch, FiFilter } from 'react-icons/fi';

const categories = ['all', 'roses', 'lilies', 'orchids', 'sunflowers', 'tulips', 'mixed', 'bouquets', 'plants', 'hamper'];
const sortOptions = [
  { label: 'Newest', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const page = Number(searchParams.get('page') || 1);

  const fetchProducts = () => {
    setLoading(true);
    productAPI.getAll({ keyword, category: category || undefined, sort: sort || undefined, page, limit: 12 })
      .then(r => { setProducts(r.data.products); setTotal(r.data.total); setPages(r.data.pages); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [category, sort, page]);

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const handleSearch = e => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <>
      <Helmet>
        <title>Shop Flowers — Bloom & Blossom</title>
        <meta name="description" content="Browse our collection of fresh roses, lilies, orchids, bouquets and gift hampers." />
      </Helmet>
      <div style={{ paddingTop: '90px', minHeight: '100vh' }}>
        {/* Shop Header */}
        <div style={{ background: 'linear-gradient(135deg, #FFF8F0, #F8BBD9)', padding: '3rem 0', textAlign: 'center' }}>
          <div className="container">
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', marginBottom: '0.75rem' }}>
              🌸 Our <span className="text-gradient">Flower Shop</span>
            </h1>
            <p style={{ color: '#6B4C5E' }}>Discover {total} fresh flowers and arrangements</p>
          </div>
        </div>

        <div className="container" style={{ padding: '2rem 1.5rem 5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}>
            {/* FILTERS */}
            <div className="filters">
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', marginBottom: '1.5rem' }}>Filters</h3>

              {/* Search */}
              <div className="filter-group">
                <div className="filter-group__title">Search</div>
                <form onSubmit={handleSearch}>
                  <div className="search-bar">
                    <FiSearch />
                    <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Search flowers..." />
                  </div>
                </form>
              </div>

              {/* Category */}
              <div className="filter-group">
                <div className="filter-group__title">Category</div>
                {categories.map(c => (
                  <label key={c} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      checked={(category || 'all') === c}
                      onChange={() => setParam('category', c === 'all' ? '' : c)}
                    />
                    <span style={{ textTransform: 'capitalize' }}>{c === 'all' ? 'All Flowers' : c}</span>
                  </label>
                ))}
              </div>

              {/* Sort */}
              <div className="filter-group">
                <div className="filter-group__title">Sort By</div>
                {sortOptions.map(s => (
                  <label key={s.value} className="filter-option">
                    <input
                      type="radio"
                      name="sort"
                      checked={sort === s.value}
                      onChange={() => setParam('sort', s.value)}
                    />
                    <span>{s.label}</span>
                  </label>
                ))}
              </div>

              {/* Offer Banner */}
              <div style={{ background: 'linear-gradient(135deg, #C2185B, #E91E8C)', borderRadius: '12px', padding: '1.25rem', color: 'white', textAlign: 'center', marginTop: '1rem' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🌹🌹🌹</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Buy 2 Get 1 FREE!</div>
                <div style={{ fontSize: '0.78rem', opacity: 0.9, marginTop: '0.25rem' }}>Auto-applied at checkout</div>
              </div>
            </div>

            {/* PRODUCTS */}
            <div>
              {/* Sort bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span style={{ color: '#6B4C5E', fontSize: '0.9rem' }}>{total} products found</span>
                <select
                  className="form-input form-select"
                  style={{ width: 'auto', padding: '0.5rem 2rem 0.5rem 0.75rem' }}
                  value={sort}
                  onChange={e => setParam('sort', e.target.value)}
                >
                  {sortOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>

              {loading ? (
                <div className="loading-overlay"><div className="spinner" /><p>Loading...</p></div>
              ) : products.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state__icon">🌸</div>
                  <h3 className="empty-state__title">No Flowers Found</h3>
                  <p className="empty-state__desc">Try different filters or search terms</p>
                </div>
              ) : (
                <>
                  <div className="grid-3">
                    {products.map(p => <ProductCard key={p._id} product={p} />)}
                  </div>
                  {/* Pagination */}
                  {pages > 1 && (
                    <div className="pagination">
                      {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                        <button
                          key={n}
                          className={`page-btn ${page === n ? 'active' : ''}`}
                          onClick={() => setParam('page', n)}
                        >{n}</button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
