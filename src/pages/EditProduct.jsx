import { useParams,useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { API_BASE_URL } from '../Config File/config';
import { useEffect,useState } from 'react';

export default function EditProduct(){
  const {id}=useParams(); const nav=useNavigate();
  const {register,handleSubmit,setValue}=useForm();
  const [images,setImages]=useState([]);

  useEffect(()=>{
    axios.get(`${API_BASE_URL}/api/products/${id}`)
      .then(r=>{
        const {images:img,...rest}=r.data;
        Object.entries(rest).forEach(([k,v])=>setValue(k,v));
        setImages(img||[]);
      });
  },[id,setValue]);

  const onSubmit=async(data)=>{
    const fd=new FormData();
    fd.append('payload',JSON.stringify(data));
    await axios.put(`${API_BASE_URL}/api/products/${id}`,fd);
    nav('/'); // go back
  };

  return(
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register('productCode')} placeholder="Code" className="border p-2 rounded w-full"/>
        <input {...register('name')} placeholder="Name" className="border p-2 rounded w-full"/>
        <input {...register('category')} placeholder="Category" className="border p-2 rounded w-full"/>
        <input {...register('price')} placeholder="Price" className="border p-2 rounded w-full"/>
        <button className="bg-blue-600 text-white px-6 py-2 rounded">Update</button>
      </form>
      {images.length>0 && (
        <div className="flex gap-2 mt-4">{images.map((src,i)=>
          <img key={i} src={`${API_BASE_URL}${src}`} alt="" className="w-16 h-16 object-cover"/>)}
        </div>
      )}
    </div>
  );
}
