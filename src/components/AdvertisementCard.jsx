import React from 'react';
import { API_BASE_URL } from '../Config File/config';

const AdvertisementCard = ({ ad, onEdit, onDelete }) => {
  return (
    <div className="border rounded p-4 shadow-sm bg-white">
      <p className="text-green-800 font-semibold">Product No. : {ad.productNumber}</p>
      <div className="flex items-center gap-2 mt-2">
        {ad.images.map((img, idx) => (
          <img
            key={idx}
            src={`${API_BASE_URL}/uploads/${img}`}
            alt="product"
            className="w-16 h-16 object-cover border"
          />
        ))}
      </div>
      <p className="mt-2 text-green-800 font-semibold">Product Category</p>
      <p>{ad.category}</p>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => onDelete(ad._id)}
          className="text-red-500 hover:underline"
        >
          🗑 Delete
        </button>
        <button
          onClick={() => onEdit(ad)}
          className="text-green-800 hover:underline"
        >
          ✎ Edit
        </button>
      </div>
    </div>
  );
};

export default AdvertisementCard;