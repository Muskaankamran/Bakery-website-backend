import { FiArrowUpRight, FiInstagram } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="page-container footer-main">
        <div className="footer-brand-block">
          <Link to="/" className="brand footer-brand">
            <span className="brand-monogram">M</span>
            <span className="brand-wordmark">maison<span>crumb</span><small>BAKERY & PATISSERIE</small></span>
          </Link>
          <p>Thoughtful bakes, beautiful ingredients, and a little sweetness in every day.</p>
          <a className="social-link" href="https://www.instagram.com/" target="_blank" rel="noreferrer"><FiInstagram /> Instagram <FiArrowUpRight /></a>
        </div>
        <div className="footer-links">
          <h3>Explore</h3>
          <Link to="/shop">Shop all</Link>
          <a href="/#about">Our story</a>
          <Link to="/profile">My account</Link>
        </div>
        <div className="footer-links">
          <h3>Get in touch</h3>
          <a href="/#contact">Contact</a>
          <p>Product questions? Please contact the bakery directly.</p>
        </div>
        <div className="footer-note">
          <span className="eyebrow">Made for moments</span>
          <p>From the first slice to the last crumb.</p>
        </div>
      </div>
      <div className="footer-bottom page-container">
        <span>© {new Date().getFullYear()} Maison Crumb Bakery</span>
        <span>Made with care, served with love.</span>
      </div>
    </footer>
  );
}
