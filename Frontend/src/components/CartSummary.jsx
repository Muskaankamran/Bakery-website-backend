import formatPrice from "../utils/formatPrice";

export default function CartSummary({ total }) {
  return (
    <aside className="cart-summary">
      <span className="eyebrow">Your order</span>
      <h2>Summary</h2>
      <div className="summary-line"><span>Subtotal</span><strong>{formatPrice(total)}</strong></div>
      <div className="summary-line summary-total"><span>Bag total</span><strong>{formatPrice(total)}</strong></div>
      <p className="backend-note">Online checkout is not available because this backend has no checkout or payment endpoint.</p>
    </aside>
  );
}
