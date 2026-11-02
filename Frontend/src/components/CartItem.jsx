import { FiPlus, FiTrash2 } from "react-icons/fi";
import formatPrice from "../utils/formatPrice";
import { ProductImage } from "./Feedback";

export default function CartItem({ item, onAdd, onRemove, busy }) {
  const product = item.product;
  if (!product || typeof product !== "object") {
    return null;
  }

  return (
    <article className="cart-item">
      <ProductImage src={product.image} alt={product.name} className="cart-item-image" />
      <div className="cart-item-copy">
        <h3>{product.name}</h3>
        <p>{product.desc}</p>
        <span className="cart-unit-price">{formatPrice(product.price)} each</span>
      </div>
      <div className="cart-item-controls">
        <div className="quantity-control" aria-label={`Quantity ${item.quantity}`}>
          <span>{item.quantity}</span>
          <button type="button" onClick={() => onAdd(product._id)} disabled={busy} aria-label="Add one more">
            <FiPlus />
          </button>
        </div>
        <strong>{formatPrice(Number(product.price) * Number(item.quantity))}</strong>
        <button className="remove-item" type="button" onClick={() => onRemove(product._id)} disabled={busy}>
          <FiTrash2 aria-hidden="true" /> Remove
        </button>
      </div>
    </article>
  );
}
