import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Config File/config";

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

import { useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { ShoppingCart, Box, DollarSign } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const data = [
    { name: "Jan", orders: 30 },
    { name: "Feb", orders: 45 },
    { name: "Mar", orders: 60 },
    { name: "Apr", orders: 50 },
    { name: "May", orders: 80 },
    { name: "Jun", orders: 70 },
  ];

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/products`),
          axios.get(`${API_BASE_URL}/api/orders/summary`),
        ]);

        setStats({
          totalProducts: productsRes.data.count || 0,
          totalOrders: ordersRes.data.count || 0,
          totalRevenue: ordersRes.data.revenue || 0,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };

    fetchStats();
  }, []);

  const cardCls = "bg-white p-6 rounded-lg shadow flex items-center gap-4";

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6 overflow-y-auto">
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
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="bg-white p-4 shadow flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center">
            <FaChartBar className="mr-2" /> Admin Dashboard
          </h2>
        </header>

        {/* Content */}
        <main className="p-8 space-y-8">
        

          <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={cardCls}>
                <Box className="w-8 h-8 text-green-700" />
                <div>
                  <h4 className="text-sm text-gray-500">Total Products</h4>
                  <p className="text-xl font-semibold">{stats.totalProducts}</p>
                </div>
              </div>

              <div className={cardCls}>
                <ShoppingCart className="w-8 h-8 text-green-700" />
                <div>
                  <h4 className="text-sm text-gray-500">Total Orders</h4>
                  <p className="text-xl font-semibold">{stats.totalOrders}</p>
                </div>
              </div>

              <div className={cardCls}>
                <DollarSign className="w-8 h-8 text-green-700" />
                <div>
                  <h4 className="text-sm text-gray-500">Revenue</h4>
                  <p className="text-xl font-semibold">Rs. {stats.totalRevenue}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-semibold mb-4">Monthly Orders Overview</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
