import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import { EmptyState, ErrorMessage } from "../components/Feedback";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { getApiErrorMessage, showErrorAlert } from "../utils/alerts";

export default function CartPage() {
  const { user } = useAuth();
  const { cartItems, total, loading, error, addToCart, removeFromCart, loadCart } = useCart();
  const [busyItem, setBusyItem] = useState("");
  const [actionError, setActionError] = useState("");
  const navigate = useNavigate();

  const runItemAction = async (productId, action) => {
    setBusyItem(productId);
    setActionError("");
    try {
      await action(productId);
    } catch (requestError) {
      const message = getApiErrorMessage(requestError, "Please try again.");
      setActionError(message);
      await showErrorAlert("Couldn't update your bag", message);
    } finally {
      setBusyItem("");
    }
  };

  if (!user) {
    return (
      <div className="page-container section-space">
        <EmptyState title="Your bag is waiting" message="Log in to see and manage items saved to your bakery bag." action={<Link to="/login" className="button button-dark">Log in</Link>} />
      </div>
    );
  }

  return (
    <div className="page-container section-space cart-page">
      <div className="shop-intro cart-intro">
        <span className="eyebrow">Saved for something sweet</span>
        <h1>Your bakery bag</h1>
        <p>Everything you picked, together in one lovely place.</p>
      </div>
      {loading ? <LoadingSpinner label="Fetching your bag…" /> : error ? (
        <ErrorMessage message={error} onRetry={() => loadCart().catch(() => {})} />
      ) : cartItems.length === 0 ? (
        <EmptyState title="Your bag is empty" message="A lovely treat is only a little browse away." action={<Link to="/shop" className="button button-dark">Continue shopping</Link>} />
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {actionError && <ErrorMessage message={actionError} />}
            {cartItems.map((item) => (
              <CartItem
                key={item.product?._id || item.product}
                item={item}
                busy={busyItem === item.product?._id}
                onAdd={(productId) => runItemAction(productId, (id) => addToCart(id, 1))}
                onRemove={(productId) => runItemAction(productId, removeFromCart)}
              />
            ))}
            <button type="button" className="text-arrow continue-link" onClick={() => navigate("/shop")}>Continue shopping</button>
          </div>
          <CartSummary total={total} />
        </div>
      )}
    </div>
  );
}
