import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { API_BASE_URL } from "../Config File/config";
import { Search } from "lucide-react";
import {
  FaBook,
  FaList,
  FaUsers,
  FaShoppingCart,
  FaSignOutAlt,
  FaChartBar,
  FaWarehouse,
  FaMoneyBillAlt,
  FaStar,
  FaBullhorn,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

/************************ Sidebar ************************/
const Sidebar = ({ onLogout }) => {
  return (
    <aside className="w-64 bg-blue-900 text-white p-6 overflow-y-auto flex-shrink-0 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FaChartBar className="mr-2" />
        Admin Panel
      </h2>
      <nav>
        <ul className="space-y-4">
          <li className="p-3 hover:bg-blue-700 rounded transition flex items-center">
                        <FaChartBar className="mr-2" />
                        <a href="/ad">Dashboard</a>
                      </li>
                      <li className="p-3 hover:bg-blue-700 rounded transition flex items-center">
                        <FaBook className="mr-2" />
                        <a href="/UploadProducts">Upload Products</a>
                      </li>
                      <li className="p-3 hover:bg-blue-700 rounded transition flex items-center">
                        <FaList className="mr-2" />
                        <a href="/order">Orders</a>
                      </li>
                      <li className="p-3 hover:bg-blue-700 rounded transition flex items-center">
                        <FaMoneyBillAlt className="mr-2" />
                        <a href="/expenses">Expenses</a>
                      </li>
                      <li className="p-3 hover:bg-blue-700 rounded transition flex items-center">
                        <FaStar className="mr-2" />
                        <a href="/Ads">Advertisement</a>
                      </li>
          <li
            className="p-3 hover:bg-red-700 rounded transition flex items-center cursor-pointer"
            onClick={onLogout}
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </li>
        </ul>
      </nav>
    </aside>
  );
};

/********************** Order Modal ***************************/
const OrderModal = ({ product, close, refresh }) => {
  const inputCls = "border p-2 rounded w-full";
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
      alert("Order placed & invoice generated");
      close();
      refresh();
    } catch (err) {
      alert("Failed to create order");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[50rem] max-h-[90vh] overflow-auto shadow-lg">
        <h2 className="text-xl font-semibold mb-4">New Order</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="border-2 border-blue-500 rounded p-4 mb-6">
            <h3 className="font-semibold mb-4">Customer Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <input {...register("customerName")} placeholder="Customer Name" className={inputCls} required />
              <input type="date" {...register("dateOfOrder")} className={inputCls} required />
              <input {...register("contactNumber")} placeholder="Contact Number" className={inputCls} required />
              <input type="email" {...register("email")} placeholder="Email ID" className={inputCls} required />
              <input {...register("billingAddress")} placeholder="Billing Address" className={inputCls + " col-span-2"} required />
              <input {...register("trackingId")} placeholder="Tracking ID" className={inputCls} readOnly />
            </div>
          </div>

          <div className="bg-white border rounded p-4 mb-6">
            <h3 className="font-semibold mb-4">Product Details</h3>
            <table className="min-w-full text-sm mb-4">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Sl. no.</th>
                  <th className="p-2">Product Code</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Sub Category</th>
                  <th className="p-2">Product Name</th>
                  <th className="p-2">Size</th>
                  <th className="p-2">Colour</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">01</td>
                  <td className="p-2">{product.productCode}</td>
                  <td className="p-2">{product.category}</td>
                  <td className="p-2">{product.subCategory}</td>
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">{product.colours?.[0]?.size || "-"}</td>
                  <td className="p-2">
                    <span
                      style={{
                        background: product.colours?.[0]?.colour || "#000",
                        display: "inline-block",
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                      }}
                    />
                  </td>
                  <td className="p-2">1</td>
                  <td className="p-2">Rs. {product.price}</td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-end text-sm pr-4 space-y-1 flex-col items-end">
              <div>Subtotal : <span className="ml-2">Rs. {subtotal}</span></div>
              <div>GST (10%) : <span className="ml-2">Rs. {gst}</span></div>
              <hr className="w-60 my-1" />
              <div className="font-semibold">Total : <span className="ml-2">Rs. {total}</span></div>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={close} className="px-4 py-2 mr-4 border rounded">
              Cancel
            </button>
            <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded">
              Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/********************** Main Orders Page ************************/
const LIMIT = 10;

export default function OrdersPage() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/products`, {
        params: { page, limit: LIMIT, search, status: "Active" },
      });
      setOrders(data.items);
      setTotal(data.total);
    } catch (err) {
      alert("Failed to load products");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, search, refreshFlag]);

  const openModal = (p) => setSelected(p);
  const closeModal = () => setSelected(null);
  const refresh = () => setRefreshFlag((f) => !f);

  const pages = Array.from({ length: Math.ceil(total / LIMIT) }, (_, i) => i + 1);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar onLogout={handleLogout} />
      <main className="flex-1 p-6 max-w-6xl mx-auto">
        <div className="flex justify-between mb-4 items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-semibold">Orders</h2>
            <button
              onClick={() => navigate("/orderlist")}
              className="bg-blue-700 text-white px-4 py-1 rounded hover:bg-blue-800 transition"
            >
              Order List
            </button>
          </div>

          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 text-gray-400 w-5 h-5" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search…"
              className="border pl-8 pr-3 py-2 rounded w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-green-50 text-green-700">
              <tr>
                <th className="p-3">Code</th>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((p) => (
                <tr key={p._id} className="border-b hover:bg-green-50">
                  <td className="p-3">{p.productCode}</td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">Rs. {p.price}</td>
                  <td className="p-3">{p.status}</td>
                  <td className="p-3">
                    <button
                      onClick={() => openModal(p)}
                      className="bg-green-600 text-white text-xs px-3 py-1 rounded"
                    >
                      Order Now
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {pages.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-full ${
                  p === page ? "bg-green-700 text-white" : "bg-white shadow"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {selected && <OrderModal product={selected} close={closeModal} refresh={refresh} />}
      </main>
    </div>
  );
}
