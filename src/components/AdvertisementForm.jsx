import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../Config File/config';

const AdvertisementForm = ({ selectedAd, onSuccess, onCancel }) => {
  const [category, setCategory] = useState('Mens');
  const [heading, setHeading] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    if (selectedAd) {
      setCategory(selectedAd.category || 'Mens');
      setHeading(selectedAd.heading || '');
      setContent(selectedAd.content || '');
      // Optionally reset images & previewUrls on edit
      setImages([]);
      setPreviewUrls([]);
    }
  }, [selectedAd]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const handleSubmit = async () => {
    if (!heading.trim() || !content.trim()) {
      alert('Please fill heading and content');
      return;
    }

    const formData = new FormData();
    formData.append('category', category);
    formData.append('heading', heading);
    formData.append('content', content);
    images.forEach((img) => formData.append('images', img));

    try {
      if (selectedAd) {
        await axios.put(`${API_BASE_URL}/api/ads/${selectedAd._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/ads`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      onSuccess();
    } catch (err) {
      console.error('Error uploading advertisement:', err);
      alert('Failed to upload advertisement. Please try again.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-xl rounded-xl space-y-5">
      <h2 className="text-2xl font-bold text-gray-800">
        {selectedAd ? 'Edit Advertisement' : 'Add New Advertisement'}
      </h2>

      <div className="space-y-2">
        <label className="font-medium text-gray-700">Product Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Mens">Mens</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="font-medium text-gray-700">Heading:</label>
        <input
          type="text"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter heading"
        />
      </div>

      <div className="space-y-2">
        <label className="font-medium text-gray-700">Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Enter advertisement content"
        />
      </div>

      <div className="space-y-2">
        <label className="font-medium text-gray-700">Upload Images:</label>
        <input type="file" multiple onChange={handleFileChange} />
        {previewUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-2">
            {previewUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt="Preview"
                className="w-full h-24 object-cover rounded border"
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-red-500 border border-red-500 rounded hover:bg-red-100 transition"
        >
          Discard
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-sm text-white bg-green-700 rounded hover:bg-green-800 transition"
        >
          {selectedAd ? 'Update' : 'Upload'}
        </button>
      </div>
    </div>
  );
};

export default AdvertisementForm;
