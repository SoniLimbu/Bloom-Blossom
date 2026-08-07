import { Link } from 'react-router-dom';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Stars = ({ rating }) => {
  return (
    <span className="product-card__stars">
      {[1,2,3,4,5].map(i => {
        if (rating >= i) return <FaStar key={i} />;
        if (rating >= i - 0.5) return <FaStarHalfAlt key={i} />;
        return <FaRegStar key={i} />;
      })}
    </span>
  );
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;
  const discountPct = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <div className="product-card">
      <div className="product-card__img">
        <img
          src={product.images?.[0] || 'https://commons.wikimedia.org/wiki/Special:FilePath/Flower%20bouquet.jpg?width=500'}
          alt={product.name}
          onError={e => { e.target.src = 'https://commons.wikimedia.org/wiki/Special:FilePath/Flower%20bouquet.jpg?width=500'; }}
        />
        {hasDiscount && (
          <div className="product-card__badge product-card__badge--offer">-{discountPct}% OFF</div>
        )}
        {!hasDiscount && product.isFeatured && (
          <div className="product-card__badge">⭐ Featured</div>
        )}
        <div className="product-card__actions">
          <Link to={`/product/${product._id}`} className="product-card__action-btn" title="View Details">
            <FiEye />
          </Link>
          <button
            className="product-card__action-btn"
            onClick={() => addToCart(product)}
            title="Add to Cart"
            style={{ color: '#C2185B' }}
          >
            <FiShoppingCart />
          </button>
        </div>
      </div>
      <div className="product-card__body">
        <div className="product-card__category">{product.category}</div>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__rating">
          <Stars rating={product.rating || 0} />
          <span className="product-card__rating-count">({product.numReviews || 0})</span>
        </div>
        <div className="product-card__price">
          <span className="product-card__price-current">₹{displayPrice.toLocaleString()}</span>
          {hasDiscount && (
            <span className="product-card__price-original">₹{product.price.toLocaleString()}</span>
          )}
        </div>
        <button
          className="btn btn-primary btn-sm product-card__add-btn"
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
        >
          <FiShoppingCart />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}