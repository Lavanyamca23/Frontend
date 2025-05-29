import React, { useEffect, useState } from "react";
import axios from "axios";
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

const Sidebar = ({ onLogout }) => (
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

const LIMIT = 10;

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/orders`, {
        params: { page, limit: LIMIT, search },
      });
      setOrders(data.items);
      setTotal(data.total);
    } catch (err) {
      alert("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, search]);

  const pages = Array.from({ length: Math.ceil(total / LIMIT) }, (_, i) => i + 1);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 p-6 max-w-6xl mx-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold">Orders</h2>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 text-gray-400 w-5 h-5" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by customer or product"
              className="border pl-8 pr-3 py-2 rounded w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-green-50 text-green-700">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Date</th>
                <th className="p-3">Total</th>
                <th className="p-3">Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, index) => (
                <tr key={index} className="border-b hover:bg-green-50">
                  <td className="p-3">{o.customer.customerName}</td>
                  <td className="p-3">{o.customer.contactNumber}</td>
                  <td className="p-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">Rs. {o.total}</td>
                  <td className="p-3">{o.items.map((i) => i.name).join(", ")}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    No orders found.
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
      </main>
    </div>
  );
}
