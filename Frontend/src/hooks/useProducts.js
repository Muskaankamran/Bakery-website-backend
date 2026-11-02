import { useCallback, useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { showErrorAlert } from "../utils/alerts";

export function getRequestError(error, label = "Request failed") {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.request) {
    return `Could not connect to the bakery API (${error.config?.baseURL || ""}${error.config?.url || ""}). Check that the backend is running.`;
  }
  return error.message || label;
}

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setProducts(await getProducts());
    } catch (requestError) {
      setError(getRequestError(requestError, "Could not load products."));
      await showErrorAlert("Couldn't load the bakery catalog", getRequestError(requestError, "Please try again."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { products, loading, error, refresh };
}
