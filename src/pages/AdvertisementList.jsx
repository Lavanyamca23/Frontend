import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBook, FaList, FaUsers, FaSignOutAlt, FaChartBar, FaWarehouse, FaMoneyBillAlt, FaStar, FaBullhorn } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const baseURL = "https://backend-3-21ho.onrender.com"; // Adjust for your server

const Advertisement = () => {
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState({
    category: "",
    heading: "",
    content: "",
    images: [],
  });
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();

  const fetchAds = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/ads`);
      setAds(res.data);
    } catch (error) {
      console.error("Failed to fetch ads:", error);
    }
  };

  const handleImageUpload = (e) => {
    setForm({ ...form, images: [...e.target.files] });
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("category", form.category);
      formData.append("heading", form.heading);
      formData.append("content", form.content);
      form.images.forEach((file) => formData.append("images", file));

      if (editingId) {
        await axios.put(`${baseURL}/api/ads/${editingId}`, formData);
      } else {
        await axios.post(`${baseURL}/api/ads`, formData);
      }

      setForm({ category: "", heading: "", content: "", images: [] });
      setEditingId(null);
      fetchAds();
    } catch (error) {
      console.error("Failed to submit ad:", error);
    }
  };

  const handleEdit = (ad) => {
    setForm({ category: ad.category, heading: ad.heading, content: ad.content, images: [] });
    setEditingId(ad._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/ads/${id}`);
      fetchAds();
    } catch (error) {
      console.error("Failed to delete ad:", error);
    }
  };

  const handleLogout = () => {
    // Clear any auth tokens or session info here
    // Then navigate to login page
    navigate("/login");
  };

  useEffect(() => {
    fetchAds();
  }, []);

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
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {ads.map((ad, index) => (
            <div key={ad._id} className="border p-4 rounded bg-white shadow">
              <p className="font-bold">Product No. : {index + 1}</p>
              <img
                src={
                  ad.images && ad.images.length > 0
                    ? `${baseURL}/uploads/${ad.images[0]}`
                    : "https://via.placeholder.com/96"
                }
                alt="Advertisement"
                className="w-24 h-24 my-2 object-cover"
              />
              <p className="font-semibold text-green-700">Product Category</p>
              <p>{ad.category}</p>
              <div className="flex justify-between mt-4 text-sm">
                <button
                  onClick={() => handleDelete(ad._id)}
                  className="text-red-500 hover:underline"
                >
                  🗑️ Delete
                </button>
                <button
                  onClick={() => handleEdit(ad)}
                  className="text-green-700 hover:underline"
                >
                  ✏️ Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border p-6 rounded bg-white shadow max-w-lg mx-auto">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Advertisement" : "Add Advertisement"}
          </h2>
          <select
            className="border p-2 w-full mb-4"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category</option>
            <option value="Mens">Mens</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            <option value="Others">Others</option>
          </select>

          <input
            type="text"
            className="border p-2 w-full mb-4"
            placeholder="Heading"
            value={form.heading}
            onChange={(e) => setForm({ ...form, heading: e.target.value })}
          />
          <textarea
            className="border p-2 w-full mb-4"
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />

          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            className="mb-4"
          />

          <div className="flex gap-4 justify-end">
            <button
              onClick={() => {
                setForm({ category: "", heading: "", content: "", images: [] });
                setEditingId(null);
              }}
              className="text-red-500 hover:underline"
            >
              Discard
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-900"
            >
              {editingId ? "Update" : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advertisement;
