'use client';

import React, { useEffect, useState } from 'react';
import { useCreateProductMutation, useUpdateProductMutation, useGetProductQuery } from '@/state/api';
import Image from 'next/image';

interface ProductModalProps {
  productId: string | null;
  onClose: () => void;
}

export default function ProductModal({ productId, onClose }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    rating: '',
    stockQuantity: '',
    image: '',
  });

  const [preview, setPreview] = useState('');
  const { data: product } = useGetProductQuery(productId!, { skip: !productId });
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        rating: product.rating?.toString() || '',
        stockQuantity: product.stockQuantity.toString(),
        image: product.image || '',
      });
      setPreview(product.image || '');
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFormData({ ...formData, image: url });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        rating: formData.rating ? parseFloat(formData.rating) : undefined,
        stockQuantity: parseInt(formData.stockQuantity),
      };

      if (productId) {
        await updateProduct({ id: productId, ...payload }).unwrap();
      } else {
        await createProduct(payload).unwrap();
      }

      onClose();
    } catch (err) {
      alert('Failed to save product');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-full">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">{productId ? 'Edit Product' : 'Create Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image */}
          <div className="flex flex-col items-center">
            {preview && (
              <div className="w-24 h-24 flex items-center justify-center overflow-hidden rounded-md border mb-2">
                <Image
                  src={preview}
                  alt="Preview"
                  width={96}
                  height={96}
                  style={{ width: '96px', height: 'auto' }}
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
          </div>

          {/* Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Rating</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 shadow-md transition-shadow"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg font-semibold hover:from-green-500 hover:to-green-700 transition-shadow shadow-md"
            >
              {productId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
