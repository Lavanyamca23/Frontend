// hooks/useProducts.js  ➜ keeps data-fetch 100 % decoupled
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Config File/config";

export const LIMIT = 10;

export default function useProducts({ page = 1, search = "" }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_BASE_URL}/api/products`, {
          params: { page, limit: LIMIT, search, status: "Active" },
        });
        setItems(data.items);
        setTotal(data.total);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, [page, search]);

  return { items, total, loading, error };
}
