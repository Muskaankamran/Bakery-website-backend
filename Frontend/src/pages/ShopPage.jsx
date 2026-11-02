import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FiRefreshCw, FiSearch } from "react-icons/fi";
import LoadingSpinner from "../components/LoadingSpinner";
import { EmptyState, ErrorMessage } from "../components/Feedback";
import ProductGrid from "../components/ProductGrid";
import useProducts from "../hooks/useProducts";

export default function ShopPage() {
  const { products, loading, error, refresh } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "featured";
  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category).filter((value) => typeof value === "string" && value.trim()))],
    [products]
  );
  const category = searchParams.get("category") || "";

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    const matches = products.filter((product) => {
      const matchesSearch = !term
        || String(product.name || "").toLocaleLowerCase().includes(term)
        || String(product.desc || "").toLocaleLowerCase().includes(term);
      const matchesCategory = !category || product.category === category;
      return matchesSearch && matchesCategory;
    });
    if (sort === "low" || sort === "high") {
      return [...matches].sort((a, b) => {
        const priceA = Number(a.price);
        const priceB = Number(b.price);
        return sort === "low" ? priceA - priceB : priceB - priceA;
      });
    }
    return matches;
  }, [products, search, category, sort]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="page-container section-space shop-page">
      <div className="shop-intro">
        <span className="eyebrow">Straight from our kitchen</span>
        <h1>Shop the bakery</h1>
        <p>Find something lovely for the table, a celebration, or just because.</p>
      </div>

      <div className="shop-toolbar">
        <label className="shop-search">
          <FiSearch aria-hidden="true" />
          <input type="search" value={search} onChange={(event) => updateParam("search", event.target.value)} placeholder="Search by name or description" aria-label="Search products" />
        </label>
        <div className="shop-filters">
          {categories.length > 0 && (
            <select value={category} onChange={(event) => updateParam("category", event.target.value)} aria-label="Filter by product category">
              <option value="">All categories</option>
              {categories.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          )}
          <select value={sort} onChange={(event) => updateParam("sort", event.target.value)} aria-label="Sort products">
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
          <button type="button" className="refresh-link" onClick={refresh} disabled={loading}><FiRefreshCw /> Refresh</button>
        </div>
      </div>
      {loading ? <LoadingSpinner label="Fetching fresh bakes…" /> : error ? (
        <ErrorMessage message={error} onRetry={refresh} />
      ) : products.length === 0 ? (
        <EmptyState title="The display case is empty" message="There are no products in the catalog right now. Please check back soon." />
      ) : filteredProducts.length === 0 ? (
        <EmptyState title="No bakes found" message="Try another search or clear your filters." action={<button className="button button-outline" onClick={() => setSearchParams({})}>Clear filters</button>} />
      ) : (
        <>
          <p className="results-count">{filteredProducts.length} {filteredProducts.length === 1 ? "treat" : "treats"} in the collection</p>
          <ProductGrid products={filteredProducts} />
        </>
      )}
    </div>
  );
}
