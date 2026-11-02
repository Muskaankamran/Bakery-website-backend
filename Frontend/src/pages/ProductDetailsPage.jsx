import { useMemo, useState } from "react";
import { FiArrowLeft, FiHeart, FiShoppingBag } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ErrorMessage, EmptyState, ProductImage } from "../components/Feedback";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductGrid from "../components/ProductGrid";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import useProducts from "../hooks/useProducts";
import formatPrice from "../utils/formatPrice";
import { getApiErrorMessage, showErrorAlert, showSuccessAlert } from "../utils/alerts";

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const { products, loading, error, refresh } = useProducts();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const product = products.find((item) => String(item._id) === String(productId));
  const related = useMemo(() => products.filter((item) => item._id !== product?._id).slice(0, 4), [products, product]);

  const add = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/products/${productId}` } });
      return;
    }
    setAdding(true);
    try {
      await addToCart(product._id);
      await showSuccessAlert("Added to your bag", `${product.name} is in your bakery bag.`);
    } catch (requestError) {
      await showErrorAlert("Couldn't add this bake", getApiErrorMessage(requestError, "Please try again."));
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <LoadingSpinner label="Finding this bake…" />;
  if (error) return <div className="page-container section-space"><ErrorMessage message={error} onRetry={refresh} /></div>;
  if (!product) {
    return <div className="page-container section-space"><EmptyState title="We couldn't find that bake" message="It may no longer be in the current catalog." action={<Link className="button button-dark" to="/shop">Browse the bakery</Link>} /></div>;
  }

  return (
    <div className="page-container section-space detail-page">
      <Link to="/shop" className="back-link"><FiArrowLeft /> Back to the bakery</Link>
      <div className="detail-layout">
        <div className="detail-photo"><ProductImage src={product.image} alt={product.name} /></div>
        <div className="detail-info">
          <span className="eyebrow">From the bakery</span>
          <h1>{product.name}</h1>
          <p className="detail-price">{formatPrice(product.price)}</p>
          <p className="detail-description">{product.desc}</p>
          <div className="detail-buttons">
            <button type="button" className="button button-dark" onClick={add} disabled={adding}><FiShoppingBag /> {adding ? "Adding…" : "Add to bag"}</button>
            <span className="made-note"><FiHeart /> Made with care</span>
          </div>
          {!user && <p className="detail-hint">Please log in to add this bake to your bag.</p>}
        </div>
      </div>
      {related.length > 0 && (
        <section className="related-section">
          <div className="section-heading"><div><span className="eyebrow">A little something else</span><h2>More from our kitchen</h2></div></div>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
