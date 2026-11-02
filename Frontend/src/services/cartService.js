import api from "../api";

export async function getCart() {
  return api.get("/cart");
}

export async function addCartItem(productId, quantity = 1) {
  return api.post("/cart/items", { productId, quantity });
}

export async function removeCartItem(productId) {
  return api.delete(`/cart/items/${productId}`);
}
