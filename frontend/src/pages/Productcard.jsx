

import { useNavigate } from 'react-router-dom';
import { useCart, useWatchlist } from "../service/api";

export default function Productcard({ products = [] }) {
  const { addToCart } = useCart();
  const { addToWatchlist } = useWatchlist();
  const navigate = useNavigate();

  const formatPrice = (value) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric.toLocaleString('en-IN') : value;
  };

  const normalizeRating = (value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 4.2;
    return Math.max(0, Math.min(5, numeric));
  };

  return (
    <div className="featured-items">
      <div className="product-grid">
        {products.map((item) => (
          <div className="product-card" key={item._id || item.id}>
            <div className="card-badges">
              {item.discount && <span className="discount-chip">{item.discount}</span>}
            </div>

            <button className="wish-btn" onClick={() => addToWatchlist(item)} aria-label="Add to wishlist">
              <i className="fas fa-heart"></i>
            </button>

            <div className="product-image">
              <img src={item.img} className="main-img" alt={item.name} />
            </div>

            <div className="product-info">
              <h4 className="title">{item.name}</h4>

              <div className="rating-row">
                <span className="stars" aria-label="rating">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const current = index + 1;
                    return (
                      <span key={current} className={current <= Math.round(normalizeRating(item.averageRating || item.rating)) ? 'star filled' : 'star'}>
                        ★
                      </span>
                    );
                  })}
                </span>
                <span className="rating-text">
                  {normalizeRating(item.averageRating || item.rating).toFixed(1)}
                  {item.totalReviews || item.reviewCount ? ` | ${(item.totalReviews || item.reviewCount).toLocaleString()} reviews` : ''}
                </span>
              </div>

              <div className="price-row">
                <span className="price">₹{formatPrice(item.price)}</span>
                {item.originalprice && <span className="original-price">₹{formatPrice(item.originalprice)}</span>}
              </div>

              <div className="cta-row">
                <button
                  className="buy-btn"
                  onClick={() => navigate(`/product/${item._id || item.id}`)}
                >
                  Buy Now
                </button>
                <button className="cart-btn" onClick={() => addToCart(item)} aria-label="Add to cart">
                  <i className="fas fa-shopping-cart"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
