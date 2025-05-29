import React, { useEffect, useState } from 'react';
import {
  FaPlus, FaSearch, FaEye, FaPen, FaTrash,
  FaBook, FaList, FaUsers, FaShoppingCart,
  FaSignOutAlt, FaChartBar, FaWarehouse,
  FaMoneyBillAlt, FaStar, FaBullhorn
} from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

import { API_BASE_URL } from '../Config File/config';
import NewProductModal from '../components/NewProductModal';

const api = axios.create({
  baseURL: API_BASE_URL,
});

const TABS = ['Active', 'Inactive', 'Out of Stock'];
const LIMIT = 10;

export default function UploadProducts() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Active');
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [openForm, setOpenForm] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/api/products', {
        params: { status: tab, page, limit: LIMIT, search }
      });
      setProducts(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [tab, page, search]);

  const pages = Array.from({ length: Math.ceil(total / LIMIT) }, (_, i) => i + 1);

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
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto bg-[#F4FFF7]">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Product Details</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <FaSearch className="absolute left-2 top-3 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search…"
                  className="pl-8 pr-3 py-2 border rounded-md bg-white"
                />
              </div>
              <button
                onClick={() => setOpenForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center"
              >
                <FaPlus className="mr-1" /> New Product
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-6 border-b mb-4">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setPage(1);
                }}
                className={`pb-2 font-medium ${
                  tab === t ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  {[
                    'Sl. no.', 'Posted on', 'Product code', 'Category', 'Sub Category',
                    'Product', 'Price', 'GST', 'Status', 'Action'
                  ].map(h => (
                    <th key={h} className="px-3 py-2 text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p._id} className="border-b group hover:bg-green-50">
                    <td className="px-3 py-2">{(page - 1) * LIMIT + i + 1}</td>
                    <td className="px-3 py-2">{new Date(p.postedOn).toLocaleDateString()}</td>
                    <td className="px-3 py-2">{p.productCode}</td>
                    <td className="px-3 py-2">{p.category}</td>
                    <td className="px-3 py-2">{p.subCategory}</td>
                    <td className="px-3 py-2">{p.name}</td>
                    <td className="px-3 py-2">Rs. {p.price}</td>
                    <td className="px-3 py-2">{p.gst}%</td>
                    <td className="px-3 py-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          p.status === 'Active'
                            ? 'text-green-700 bg-green-200'
                            : p.status === 'Inactive'
                              ? 'text-yellow-600 bg-yellow-100'
                              : 'text-red-600 bg-red-100'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                        <FaEye className="text-gray-500 cursor-pointer" />
                        <Link to={`/edit-product/${p._id}`}>
                          <FaPen className="text-blue-600 cursor-pointer" />
                        </Link>
                        <FaTrash className="text-red-600 cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                ))}
                {!products.length && (
                  <tr>
                    <td colSpan={10} className="text-center py-6 text-gray-400">
                      No products
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-2 py-1 rounded bg-white shadow"
              disabled={page === 1}
            >
              &lt;
            </button>
            {pages.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-full ${
                  p === page ? 'bg-green-700 text-white' : 'bg-white shadow'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, pages.length))}
              className="px-2 py-1 rounded bg-white shadow"
              disabled={page === pages.length}
            >
              &gt;
            </button>
          </div>

          {/* Chart */}
          <div className="mt-8 bg-white p-6 rounded shadow">
            <h4 className="font-semibold mb-4">Orders trend</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={products.slice(0, 6).map((p, i) => ({
                  name: i + 1,
                  price: p.price,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#16a34a" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </main>

        {/* Modal Form */}
        {openForm && (
          <NewProductModal
            close={() => setOpenForm(false)}
            refresh={fetchProducts}
          />
        )}
      </div>
    </div>
  );
}
