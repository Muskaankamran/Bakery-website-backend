import { useState } from "react";
import { FiArrowUpRight, FiShoppingBag } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import formatPrice from "../utils/formatPrice";
import { getApiErrorMessage, showErrorAlert, showSuccessAlert } from "../utils/alerts";
import { ProductImage } from "./Feedback";

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!user) {
      navigate("/login", { state: { from: `${location.pathname}${location.search}` } });
      return;
    }
    setAdding(true);
    try {
      await addToCart(product._id, 1);
      await showSuccessAlert("Added to your bag", `${product.name} is in your bakery bag.`);
    } catch (requestError) {
      await showErrorAlert("Couldn't add this bake", getApiErrorMessage(requestError, "Please try again."));
    } finally {
      setAdding(false);
    }
  };

  return (
    <article className="product-card">
      <Link to={`/products/${product._id}`} className="product-card-image" aria-label={`View ${product.name}`}>
        <ProductImage src={product.image} alt={product.name} />
        <span className="image-link-icon"><FiArrowUpRight /></span>
      </Link>
      <div className="product-card-content">
        <div className="product-card-heading">
          <h3><Link to={`/products/${product._id}`}>{product.name}</Link></h3>
          <span className="product-price">{formatPrice(product.price)}</span>
        </div>
        <p>{product.desc}</p>
        <div className="product-card-actions">
          <Link to={`/products/${product._id}`} className="button button-outline">View details</Link>
          <button type="button" className="button button-dark" onClick={handleAdd} disabled={adding}>
            <FiShoppingBag aria-hidden="true" /> {adding ? "Adding…" : "Add to bag"}
          </button>
        </div>
      </div>
    </article>
  );
}
