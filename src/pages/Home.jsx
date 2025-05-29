import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { API_BASE_URL } from "../Config File/config";
import { Search } from "lucide-react";

const OrderModal = ({ product, close, refresh }) => {
  const inputCls = "border border-blue-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500";
  const { register, handleSubmit } = useForm({
    defaultValues: {
      customerName: "",
      dateOfOrder: new Date().toISOString().substr(0, 10),
      contactNumber: "",
      email: "",
      billingAddress: "",
      trackingId: `TRK-${Date.now()}`,
    },
  });

  const subtotal = product.price;
  const gst = +(subtotal * 0.1).toFixed(2);
  const total = +(subtotal + gst).toFixed(2);

  const onSubmit = async (data) => {
    try {
      await axios.post(`${API_BASE_URL}/api/orders`, {
        customer: data,
        items: [product],
        subtotal,
        gst,
        total,
      });
      alert("Order placed successfully!");
      close();
      refresh();
    } catch (err) {
      alert("Order failed. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto shadow-xl border border-blue-200">
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-700">Place Your Order</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <fieldset className="border border-blue-500 rounded p-4">
            <legend className="font-semibold text-xl px-2 text-blue-700">Your Details</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
              <input {...register("customerName")} placeholder="Full Name" className={inputCls} required />
              <input type="date" {...register("dateOfOrder")} className={inputCls} required />
              <input {...register("contactNumber")} placeholder="Contact Number" className={inputCls} required />
              <input type="email" {...register("email")} placeholder="Email Address" className={inputCls} required />
              <input {...register("billingAddress")} placeholder="Billing Address" className={inputCls + " sm:col-span-2"} required />
              <input {...register("trackingId")} className={inputCls + " bg-blue-50 cursor-not-allowed"} readOnly />
            </div>
          </fieldset>

          <fieldset className="border rounded p-4 bg-blue-50 border-blue-300">
            <legend className="font-semibold text-xl px-2 text-blue-700">Product Summary</legend>
            <div className="mt-5">
              <h3 className="font-medium mb-3 text-blue-800">{product.name}</h3>
              <p className="text-blue-700"><strong>Category:</strong> {product.category} / {product.subCategory}</p>
              <p className="text-blue-700"><strong>Price:</strong> Rs. {product.price}</p>
              <p className="text-blue-700"><strong>Size:</strong> {product.colours?.[0]?.size || "-"}</p>
              <div className="flex items-center space-x-2 mt-3">
                <strong className="text-blue-700">Colour:</strong>
                <span
                  style={{
                    background: product.colours?.[0]?.colour || "#000",
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            </div>
            <hr className="my-5 border-blue-300" />
            <div className="flex justify-end space-y-1 flex-col text-right text-sm text-blue-800">
              <div>Subtotal: <span className="font-semibold">Rs. {subtotal}</span></div>
              <div>GST (10%): <span className="font-semibold">Rs. {gst}</span></div>
              <div className="text-xl font-bold">Total: Rs. {total}</div>
            </div>
          </fieldset>

          <div className="flex justify-end space-x-5">
            <button
              type="button"
              onClick={close}
              className="px-6 py-2 border border-blue-400 rounded hover:bg-blue-100 text-blue-700 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold transition"
            >
              Confirm Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LIMIT = 12;

export default function TextileHomePage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/products`, {
        params: { page, limit: LIMIT, search, status: "Active" },
      });
      setProducts(data.items);
      setTotal(data.total);
    } catch (err) {
      alert("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, refreshFlag]);

  const openModal = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);
  const refresh = () => setRefreshFlag((f) => !f);
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col font-sans">
      {/* Hero Section */}
      <section
        className="bg-[url('https://images.unsplash.com/photo-1603252109303-2751441b9b59')] bg-cover bg-center h-[50vh] flex flex-col justify-center items-center text-center px-6"
        style={{ backgroundBlendMode: "multiply", backgroundColor: "rgba(30, 64, 175, 0.6)" }}
      >
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg mb-5 leading-tight">
          Discover Premium Fabrics for Every Occasion
        </h2>
        <a
          href="#products"
          className="bg-white text-blue-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-100 transition"
        >
          Shop Now
        </a>
      </section>

      {/* Products */}
      <section id="products" className="flex-1 py-14">
        <div className="max-w-7xl mx-auto px-6">
          {/* Search */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-5">
            <h3 className="text-3xl font-bold text-blue-900">Our Products</h3>
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-4 text-blue-400 w-5 h-5" />
              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <p className="text-center text-blue-700 mt-24 text-lg font-medium">No products found.</p>
          ) : (
            <div className="grid gap-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md p-5 flex flex-col hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openModal(product)}
                >
                  <div className="h-48 bg-blue-50 rounded-md flex items-center justify-center mb-5 overflow-hidden">
                    <img
                      src={product.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-1 truncate text-blue-900" title={product.name}>
                    {product.name}
                  </h3>
                  <p className="text-sm text-blue-700 mb-2 truncate">
                    {product.category} / {product.subCategory}
                  </p>
                  <p className="text-blue-700 font-bold text-lg mb-4">Rs. {product.price}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(product);
                    }}
                    className="mt-auto bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
                  >
                    Order Now
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12 space-x-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-11 h-11 rounded-full font-semibold shadow-md transition ${
                    p === page
                      ? "bg-blue-700 text-white"
                      : "bg-white text-blue-700 hover:bg-blue-100"
                  }`}
                  aria-label={`Go to page ${p}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-blue-900 text-blue-100 py-7">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm font-medium">
          <p>&copy; {new Date().getFullYear()} Textile Store. All rights reserved.</p>
        </div>
      </footer>

      {/* Order Modal */}
      {selectedProduct && <OrderModal product={selectedProduct} close={closeModal} refresh={refresh} />}
    </main>
  );
}
