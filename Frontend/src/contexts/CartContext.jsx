import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { addCartItem, getCart, removeCartItem } from "../services/cartService";
import { useAuth } from "./AuthContext";
import { getApiErrorMessage, showErrorAlert } from "../utils/alerts";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const calculateCount = (items) =>
    items.reduce((total, item) => total + Number(item.quantity || 0), 0);

  const loadCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      setError("");
      return [];
    }

    try {
      setLoading(true);
      setError("");
      const { data } = await getCart();
      if (!Array.isArray(data?.cart)) {
        throw new Error("The cart API returned an invalid response.");
      }
      const items = data.cart;
      setCartItems(items);
      return items;
    } catch (requestError) {
      const message = getApiErrorMessage(requestError, "Could not load your bakery bag.");
      setError(message);
      await showErrorAlert("Couldn't load your bag", message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setError("");
      return;
    }

    loadCart().catch(() => {});
  }, [user, loadCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      throw new Error("Please log in to add products to your bag");
    }

    const { data } = await addCartItem(productId, quantity);
    if (!Array.isArray(data?.cart)) {
      throw new Error("The cart API returned an invalid response.");
    }
    const items = data.cart;
    setCartItems(items);
    setError("");
    return data;
  };

  const removeFromCart = async (productId) => {
    if (!user) {
      throw new Error("Please log in to manage your bag");
    }

    const { data } = await removeCartItem(productId);
    if (!Array.isArray(data?.cart)) {
      throw new Error("The cart API returned an invalid response.");
    }
    const items = data.cart;
    setCartItems(items);
    setError("");
    return data;
  };

  const total = cartItems.reduce((sum, item) => {
    const price = Number(item.product?.price);
    if (!Number.isFinite(price)) {
      return sum;
    }
    return sum + price * Number(item.quantity || 0);
  }, 0);

  const cartCount = calculateCount(cartItems);

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      total,
      loading,
      error,
      loadCart,
      addToCart,
      removeFromCart,
    }),
    [cartItems, cartCount, total, loading, error, loadCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
