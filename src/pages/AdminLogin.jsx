import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../Config File/config';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '', isRegister: false });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = form.isRegister
      ? `${API_BASE_URL}/api/admin/register`
      : `${API_BASE_URL}/api/admin/login`;

    try {
      const res = await axios.post(url, {
        email: form.email,
        password: form.password,
      });

      alert(res.data.message);

      if (form.isRegister) {
        // Switch to login form view
        setForm({ ...form, isRegister: false });
      } else {
        // Navigate to dashboard
        navigate('/ad');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center">
      
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          {form.isRegister ? 'Admin Register' : 'Admin Login'}
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold"
        >
          {form.isRegister ? 'Register' : 'Login'}
        </button>

        <p
          className="mt-4 text-sm text-center cursor-pointer underline"
          onClick={() => setForm({ ...form, isRegister: !form.isRegister })}
        >
          {form.isRegister
            ? 'Already have an account? Login'
            : 'New admin? Register here'}
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;
