import api from "../api";

export async function getProducts() {
  const { data } = await api.get("/products");
  const products = Array.isArray(data) ? data : data?.products;
  if (!Array.isArray(products)) {
    throw new Error("The products API returned an invalid response.");
  }
  return products;
}

export async function createProduct(product) {
  return api.post("/products/create", product);
}

export async function updateProduct(productId, product) {
  return api.put(`/products/${productId}`, product);
}

export async function deleteProduct(productId) {
  return api.delete(`/products/${productId}`);
}
