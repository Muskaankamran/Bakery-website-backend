import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiRefreshCw, FiTag, FiTrash2, FiX } from "react-icons/fi";
import { ErrorMessage, ProductImage } from "../components/Feedback";
import LoadingSpinner from "../components/LoadingSpinner";
import { deleteProduct, createProduct, updateProduct } from "../services/productService";
import useProducts, { getRequestError } from "../hooks/useProducts";
import formatPrice from "../utils/formatPrice";
import { confirmAction, showErrorAlert, showSuccessAlert, showValidationAlert } from "../utils/alerts";

const initialForm = { name: "", desc: "", price: "" };

export default function AdminPage() {
  const { products, loading, error, refresh } = useProducts();
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");
  useEffect(() => {
    if (!image) return undefined;
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const startEdit = (product) => {
    setEditing(product);
    setForm({ name: product.name, desc: product.desc, price: String(product.price ?? "") });
    setImage(null);
    setPreview(product.image || "");
    document.getElementById("add-product")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const reset = () => {
    setEditing(null);
    setForm(initialForm);
    setImage(null);
    setPreview("");
  };

  const submit = async (event) => {
    event.preventDefault();
    const price = Number(form.price);
    if (!form.name.trim() || !form.desc.trim() || form.price === "" || !Number.isFinite(price) || price < 0) {
      await showValidationAlert("Enter a product name, description, and valid nonnegative price.");
      return;
    }
    if (!editing && !image) {
      await showValidationAlert("Choose an image for the new product.");
      return;
    }

    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("desc", form.desc.trim());
    payload.append("price", String(price));
    if (image) payload.append("image", image);

    setSaving(true);
    try {
      if (editing) await updateProduct(editing._id, payload);
      else await createProduct(payload);
      await showSuccessAlert(editing ? "Product updated" : "Product added", editing ? "Your product changes have been saved." : "The product is now in the bakery catalog.");
      reset();
      await refresh();
    } catch (requestError) {
      await showErrorAlert("Product could not be saved", getRequestError(requestError, "Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (product) => {
    const confirmed = await confirmAction(
      `Delete ${product.name}?`,
      "This will permanently remove this product from the catalog.",
      "Delete product"
    );
    if (!confirmed) return;
    setBusyId(product._id);
    try {
      await deleteProduct(product._id);
      await showSuccessAlert("Product deleted", `${product.name} was removed from the catalog.`);
      await refresh();
    } catch (requestError) {
      await showErrorAlert("Product could not be deleted", getRequestError(requestError, "Please try again."));
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="page-container section-space admin-page">
      <div className="admin-heading">
        <div><span className="eyebrow">Verified administrator</span><h1>Admin Dashboard</h1><p>Manage products in the live catalog.</p></div>
        <button type="button" className="button button-outline" onClick={refresh} disabled={loading}><FiRefreshCw /> Refresh catalog</button>
      </div>
      <nav className="admin-section-nav" aria-label="Admin dashboard sections">
        <a href="#add-product">Add Product</a>
        <a href="#manage-products">Manage Products</a>
        <a href="#discounts">Discounts</a>
      </nav>

      <div className="admin-layout">
        <section className="admin-form-card" id="add-product">
          <span className="eyebrow">{editing ? "Update listing" : "New listing"}</span>
          <h2>{editing ? "Edit product" : "Add Product"}</h2>
          <form onSubmit={submit}>
            <label className="form-field"><span>Product name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
            <label className="form-field"><span>Description</span><textarea rows="4" value={form.desc} onChange={(event) => setForm({ ...form, desc: event.target.value })} required /></label>
            <label className="form-field"><span>Price</span><input type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required /></label>
            <label className="form-field"><span>Product image {editing && "(optional when editing)"}</span><input type="file" accept="image/*" onChange={(event) => {
              const nextImage = event.target.files?.[0] || null;
              if (nextImage && nextImage.size > 5 * 1024 * 1024) {
                showValidationAlert("Image must be 5 MB or smaller.");
                event.target.value = "";
                return;
              }
              setImage(nextImage);
              if (!nextImage && editing) setPreview(editing.image || "");
            }} /></label>
            <p className="field-hint">The backend accepts image files up to 5 MB.</p>
            {preview && <div className="admin-preview"><img src={preview} alt="Product image preview" /></div>}
            <div className="form-actions">
              <button type="submit" className="button button-dark" disabled={saving}><FiPlus /> {saving ? "Saving…" : editing ? "Save changes" : "Add product"}</button>
              {editing && <button type="button" className="button button-outline" onClick={reset} disabled={saving}><FiX /> Cancel</button>}
            </div>
          </form>
        </section>

        <section className="admin-table-card" id="manage-products">
          <div className="admin-table-heading"><div><span className="eyebrow">Live inventory</span><h2>Manage Products <small>{products.length}</small></h2></div></div>
          {loading ? <LoadingSpinner label="Loading catalog…" /> : error ? <ErrorMessage message={error} onRetry={refresh} /> : products.length === 0 ? (
            <p className="admin-empty">The backend catalog is empty. Add a product to get started.</p>
          ) : (
            <div className="table-scroll">
              <table className="admin-table">
                <thead><tr><th>Image</th><th>Product</th><th>Price</th><th>Actions</th></tr></thead>
                <tbody>{products.map((product) => (
                  <tr key={product._id}>
                    <td><ProductImage src={product.image} alt={product.name} className="admin-product-image" /></td>
                    <td><strong>{product.name}</strong><span className="table-description">{product.desc}</span></td>
                    <td>{formatPrice(product.price)}</td>
                    <td><div className="table-actions">
                      <button type="button" className="table-action" onClick={() => startEdit(product)} aria-label={`Edit ${product.name}`}><FiEdit2 /></button>
                      <button type="button" className="table-action table-delete" onClick={() => remove(product)} disabled={busyId === product._id} aria-label={`Delete ${product.name}`}><FiTrash2 /></button>
                    </div></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <section className="admin-discounts-card" id="discounts">
        <div className="admin-discounts-icon"><FiTag aria-hidden="true" /></div>
        <div>
          <span className="eyebrow">Promotions</span>
          <h2>Discounts</h2>
          <p>Discount management is not available in the current backend API. No discounts are being created or changed.</p>
        </div>
      </section>
    </div>
  );
}
