import React, { useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import { API_BASE_URL } from '../Config File/config';

/* ------------------ validation schema ------------------ */
const schema = yup.object({
  productCode: yup.string().required(),
  name:        yup.string().required(),
  category:    yup.string().required(),
  subCategory: yup.string().required(),
  productType: yup.string().required(),
  status:      yup.string().oneOf(['Active','Inactive','Out of Stock']).required(),
  price:       yup.number().required(),
  gst:         yup.number().required(),
  colours: yup.array().of(
    yup.object({
      colour:   yup.string().required(),
      size:     yup.string().required(),
      quantity: yup.number().required()
    })
  )
});

/* ------------------ option lists ------------------ */
const categoryOptions = ['Men', 'Women', 'Kids', 'Home Textiles'];
const subCategoryOptions = {
  Men: ['Handloom Readymade Shirts', 'Readymade Shirts', 'Premium Cotton/Linen White Shirts','Printed Shirts'],
  Women: ['Silk Cotton Sarees', 'Kodali Karuppur - Revival Sarees', 'Kancheepuram Pure Zari Silk Sarees - GI','Kalamkari Print Sarees'],
  Kids: ['Boys Wear', 'Girls Wear'],
  'Home Textiles': ['Bhavani Jamakkalam - GI', 'Door Curtains', 'Meerut Printed Bedsheets', 'Ahmedabad Print Bedsheets']
};
const productTypeOptions = {
  Men:            ['Formal Wear', 'Casual Wear', 'Winter Wear'],
  Women:          ['Ethnic Wear', 'Western Wear', 'Nightwear'],
  Kids:           ['Infants', 'Toddlers', 'Teens'],
  'Home Textiles':['Bedroom', 'Living Room', 'Bathroom']
};
const statusOptions = ['Active','Inactive','Out of Stock'];

const inputCls = 'border p-2 rounded w-full';

export default function NewProductModal({ close, refresh }) {
  const {
    register,
    handleSubmit,
    control,
    reset
  } = useForm({
    defaultValues: {
      colours:[{ colour:'#800000', size:'S', quantity:10 }],
      status:'Active'                                  // ← default status
    },
    resolver: yupResolver(schema)
  });

  const { fields, append, remove } = useFieldArray({ control, name:'colours' });
  const [images, setImages] = useState([]);

  /* watch category to drive dependent dropdowns */
  const selectedCategory = useWatch({ control, name:'category' });
  const subCategories   = subCategoryOptions[selectedCategory]  || [];
  const productTypes    = productTypeOptions[selectedCategory]  || [];

  /* submit */
  const onSubmit = async (data) => {
    const fd = new FormData();
    fd.append('payload', JSON.stringify(data));
    images.forEach(img => fd.append('images', img));
    await axios.post(`${API_BASE_URL}/api/products`, fd);
    refresh();
    reset();
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full relative overflow-auto max-h-[90vh]">
        <button onClick={close} className="absolute top-4 right-4 text-gray-500">
          <FaTimes />
        </button>
        <h2 className="text-xl font-semibold mb-6">New Product</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          {/* Product Code */}
          <input {...register('productCode')} placeholder="Product Code" className={inputCls} />

          {/* Category */}
          <select {...register('category')} className={inputCls}>
            <option value="">Select Category</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Sub Category */}
          <select {...register('subCategory')} className={inputCls}>
            <option value="">Select Sub Category</option>
            {subCategories.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>

          {/* Product Name */}
          <input {...register('name')} placeholder="Product Name" className={inputCls} />

          {/* Product Type */}
          <select {...register('productType')} className={inputCls}>
            <option value="">Select Product Type</option>
            {productTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* Status */}
          <select {...register('status')} className={inputCls}>
            {statusOptions.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          {/* Price & GST */}
          <input type="number" {...register('price')} placeholder="Price" className={inputCls} />
          <input type="number" {...register('gst')}   placeholder="GST %" className={inputCls} />

          {/* Colours / Sizes */}
          <div className="col-span-2">
            <h4 className="font-medium mb-2">Available Colours, Sizes & Quantity</h4>
            {fields.map((f, idx) => (
              <div key={f.id} className="grid grid-cols-8 gap-2 mb-2 items-center">
                <input type="color" {...register(`colours.${idx}.colour`)} defaultValue={f.colour} />
                <input {...register(`colours.${idx}.size`)} placeholder="Size" className={inputCls} />
                <input type="number" {...register(`colours.${idx}.quantity`)} placeholder="Qty" className={inputCls} />
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="text-red-600 col-span-1 text-xs underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ colour:'#800000', size:'', quantity:0 })}
              className="text-green-600 text-sm underline"
            >
              Add More
            </button>
          </div>

          {/* Images */}
          <div className="col-span-2">
            <h4 className="font-medium mb-2">Images</h4>
            <input type="file" multiple accept="image/*" onChange={e => setImages([...e.target.files])} />
            {images.length > 0 && (
              <div className="flex gap-2 mt-2">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="w-12 h-12 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-between mt-6">
            <button type="button" onClick={close} className="text-red-600">Discard</button>
            <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded">Continue</button>
          </div>
        </form>
      </div>
    </div>
  );
}
