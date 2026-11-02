import { Link } from "react-router-dom";
import { FiArrowRight, FiArrowUpRight, FiHeart, FiMapPin, FiRefreshCw, FiStar } from "react-icons/fi";
import LoadingSpinner from "../components/LoadingSpinner";
import { EmptyState, ErrorMessage } from "../components/Feedback";
import ProductGrid from "../components/ProductGrid";
import useProducts from "../hooks/useProducts";

const heroImage = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1500&q=85";

export default function HomePage() {
  const { products, loading, error, refresh } = useProducts();

  return (
    <>
      <section className="hero-section">
        <div className="hero-photo" style={{ backgroundImage: `url("${heroImage}")` }} aria-hidden="true" />
        <div className="hero-shade" />
        <div className="page-container hero-content">
          <span className="eyebrow hero-eyebrow">A little sweetness, made by hand</span>
          <h1>Baked With Love,<br />Made to Delight.</h1>
          <p>Beautifully made bakes for the moments worth making memorable.</p>
          <Link to="/shop" className="button button-cream">Shop our collection <FiArrowRight /></Link>
          <span className="hero-footnote">Handcrafted in small batches · Made fresh with care</span>
        </div>
        <a className="hero-scroll" href="#featured">Discover the collection <span /></a>
      </section>

      <section className="promise-strip page-container" aria-label="Our values">
        <span><FiHeart /> Made with care</span>
        <span><FiStar /> Thoughtful ingredients</span>
        <span><FiMapPin /> From our kitchen to you</span>
      </section>

      <section id="featured" className="section-space page-container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">The good things</span>
            <h2>Featured from our kitchen</h2>
            <p>A considered collection, fetched fresh from our bakery.</p>
          </div>
          <div className="heading-actions">
            <button type="button" className="refresh-link" onClick={refresh} disabled={loading}><FiRefreshCw /> Refresh</button>
            <Link to="/shop" className="arrow-link">Shop all <FiArrowUpRight /></Link>
          </div>
        </div>
        {loading ? <LoadingSpinner label="Fetching fresh bakes…" /> : error ? (
          <ErrorMessage message={error} onRetry={refresh} />
        ) : products.length ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyState title="Our display case is waiting" message="There are no products in the catalog yet. Please check back soon." />
        )}
      </section>

      <section className="best-sellers-section">
        <div className="page-container">
          <div className="section-heading section-heading-light">
            <div>
              <span className="eyebrow">Made for sharing</span>
              <h2>Best sellers</h2>
              <p>Browse the treats currently available from our kitchen.</p>
            </div>
            <Link to="/shop" className="arrow-link">Explore all bakes <FiArrowUpRight /></Link>
          </div>
          {loading ? <LoadingSpinner label="Fetching fresh bakes…" /> : error ? (
            <ErrorMessage message={error} onRetry={refresh} />
          ) : products.length ? (
            <ProductGrid products={products.slice(0, 3)} />
          ) : (
            <EmptyState title="Nothing in the case just yet" message="New bakes will appear here as soon as they are added to the catalog." />
          )}
          <p className="catalog-note">Our catalog API doesn't include sales rankings; these are the latest available products.</p>
        </div>
      </section>

      <section className="about-section page-container" id="about">
        <div className="about-art" role="img" aria-label="A carefully prepared cake on a table">
          <div className="about-image" />
          <span className="about-stamp">BAKED<br />WITH<br />HEART</span>
        </div>
        <div className="about-copy">
          <span className="eyebrow">A bakery with heart</span>
          <h2>Good things take<br /><em>a little time.</em></h2>
          <p>We believe the best bakes begin with care: thoughtful ingredients, patient hands, and a reason to bring people together. Every treat in our collection comes straight from our bakery catalog.</p>
          <Link to="/shop" className="text-arrow">Meet your next favorite <FiArrowRight /></Link>
          <div className="about-signoff">Made with love, always <span>— Maison Crumb</span></div>
        </div>
      </section>

      <section className="reasons-section">
        <div className="page-container">
          <div className="section-heading centered-heading">
            <span className="eyebrow">The Maison Crumb way</span>
            <h2>A little more lovely</h2>
          </div>
          <div className="reasons-grid">
            <article><span>01</span><h3>Made with intention</h3><p>We take the time to make every detail feel special.</p></article>
            <article><span>02</span><h3>Beautifully simple</h3><p>Thoughtful bakes, made to be enjoyed and shared.</p></article>
            <article><span>03</span><h3>Always worth a moment</h3><p>A little pause for something wonderful, any day.</p></article>
          </div>
        </div>
      </section>

      <section className="testimonial-section page-container">
        <span className="eyebrow">A note from our community</span>
        <blockquote>“The loveliest little centerpiece for our Sunday table.”</blockquote>
        <p>Illustrative testimonial — not a verified customer review.</p>
      </section>
    </>
  );
}
