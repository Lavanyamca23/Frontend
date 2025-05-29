import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function OrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [customer, setCustomer] = useState({ name: '', contact: '', location: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://https://backend-3-21ho.onrender.com/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load product.');
        setLoading(false);
      });
  }, [id]);

  const handleChange = e => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!customer.name || !customer.contact) {
      alert('Please fill all customer details');
      return;
    }

    const orderData = {
      customer,
      items: [
        {
          productCode: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ],
      subtotal: product.price,
      gst: +(product.price * 0.18).toFixed(2),
      total: +(product.price * 1.18).toFixed(2),
    };

    try {
      const res = await axios.post('https://backend-3-21ho.onrender.com/api/orders', orderData);
      alert('Order placed successfully! Order ID: ' + res.data._id);
      navigate('/');
    } catch (err) {
      alert('Failed to place order: ' + err.message);
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Order: {product.name}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={customer.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Contact</label>
          <input
            type="text"
            name="contact"
            value={customer.contact}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={customer.location}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="text-lg font-semibold">
          <p>Price: ₹{product.price}</p>
          <p>GST (18%): ₹{(product.price * 0.18).toFixed(2)}</p>
          <p>Total: ₹{(product.price * 1.18).toFixed(2)}</p>
        </div>

        <button
          type="submit"
          className="w-full rounded bg-indigo-600 py-2 text-white font-semibold hover:bg-indigo-700 transition"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
