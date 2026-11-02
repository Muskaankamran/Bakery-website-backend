import ProductCard from "./ProductCard";
import { EmptyState } from "./Feedback";

export default function ProductGrid({ products, emptyTitle = "No products found", emptyMessage = "Try changing your search." }) {
  if (!products.length) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }
  return (
    <div className="product-grid">
      {products.map((product) => <ProductCard key={product._id} product={product} />)}
    </div>
  );
}
