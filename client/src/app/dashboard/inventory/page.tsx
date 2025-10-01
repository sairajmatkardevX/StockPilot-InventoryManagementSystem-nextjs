'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAppSelector } from '@/app/redux';
import { useGetProductsQuery } from '@/state/api';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
  image?: string;
}

export default function InventoryPage() {
  const isDarkMode = useAppSelector(state => state.global.isDarkMode);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6); // Reduced from 10 to 6
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const { data, isLoading, isError } = useGetProductsQuery({
    page: page,
    limit: pageSize,
    search: debouncedSearch,
  });

  const products: Product[] = useMemo(() => {
    if (!data?.products) return [];
    const images = [
      '/images/products/product1.png',
      '/images/products/product2.png',
      '/images/products/product3.png',
      '/images/products/product4.png',
      '/images/products/product5.png',
      '/images/products/product6.png',
    ];
    return data.products.map((p, index) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      rating: p.rating ? Math.round(p.rating * 10) / 10 : 0,
      stockQuantity: p.stockQuantity ?? 0,
      image: images[index % images.length],
    }));
  }, [data?.products]);

  if (isLoading) return <div className="p-4">Loading inventory...</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load inventory</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Inventory</h1>
      </div>

      {/* Search */}
      <div className="mb-4 w-full md:w-1/3">
        <input
          type="text"
          placeholder="Search inventory..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Table */}
      <div className={`overflow-x-auto rounded-lg shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}>
            <tr>
              <th className="p-2 border-b text-center w-16">Image</th>
              <th className="p-2 border-b text-center w-36">Name</th>
              <th className="p-2 border-b text-center w-24">Price</th>
              <th className="p-2 border-b text-center w-24">Stock</th>
              <th className="p-2 border-b text-center w-24">Rating</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product.id}
                className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
              >
                {/* Image */}
                <td className="p-2 border-b flex justify-center">
                  <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-md border">
                    <Image
                      src={product.image || '/images/products/product1.png'}
                      alt={product.name}
                      width={48}
                      height={48}
                      style={{ width: '48px', height: 'auto' }}
                      className="object-contain"
                    />
                  </div>
                </td>

                <td className="p-2 border-b text-center">{product.name}</td>
                <td className="p-2 border-b text-center">₹{product.price}</td>
                <td className="p-2 border-b text-center">{product.stockQuantity}</td>
                <td className="p-2 border-b text-center">{product.rating ?? '-'}</td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
        >
          Previous
        </button>
        <span className="font-medium">
          Page {data?.pagination?.page || 1} of {data?.pagination?.totalPages || 1}
        </span>
        <button
          disabled={page === data?.pagination?.totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}