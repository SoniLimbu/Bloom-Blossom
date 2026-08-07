import { Link } from 'react-router-dom';
import { MdLocalFlorist } from 'react-icons/md';
import { FaFacebook, FaInstagram, FaTwitter, FaPinterest } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <span className="footer__logo">🌸 Bloom & Blossom</span>
            <p className="footer__desc">Bringing nature's finest blooms to your doorstep. Every flower tells a story — let us help you tell yours.</p>
            <div className="footer__social">
              <a href="#" className="social-btn"><FaFacebook /></a>
              <a href="#" className="social-btn"><FaInstagram /></a>
              <a href="#" className="social-btn"><FaTwitter /></a>
              <a href="#" className="social-btn"><FaPinterest /></a>
            </div>
          </div>
          <div>
            <h4 className="footer__heading">Quick Links</h4>
            <div className="footer__links">
              <Link to="/" className="footer__link">Home</Link>
              <Link to="/shop" className="footer__link">Shop</Link>
              <a href="#offers" className="footer__link">Offers</a>
              <Link to="/login" className="footer__link">My Account</Link>
            </div>
          </div>
          <div>
            <h4 className="footer__heading">Categories</h4>
            <div className="footer__links">
              <Link to="/shop?category=roses" className="footer__link">Roses</Link>
              <Link to="/shop?category=lilies" className="footer__link">Lilies</Link>
              <Link to="/shop?category=orchids" className="footer__link">Orchids</Link>
              <Link to="/shop?category=bouquets" className="footer__link">Bouquets</Link>
              <Link to="/shop?category=hamper" className="footer__link">Gift Hampers</Link>
            </div>
          </div>
          <div id="contact">
            <h4 className="footer__heading">Contact Us</h4>
            <div className="footer__links">
              <span className="footer__link">📍 Kathmandu, Nepal</span>
              <span className="footer__link">📞 +977 98-0000-0000</span>
              <span className="footer__link">✉️ hello@bloomblossom.com</span>
              <span className="footer__link">🕐 Mon-Sat: 9AM - 8PM</span>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Bloom & Blossom. Made with 🌸 in Nepal</p>
        </div>
      </div>
    </footer>
  );
}
