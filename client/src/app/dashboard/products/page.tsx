'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useGetProductsQuery, useDeleteProductMutation } from '@/state/api';
import ProductModal from './ProductModal';
import { useAppSelector } from '@/app/redux';
import Image from 'next/image';

export default function ProductsPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const [page, setPage] = useState(1);
  const [limit] = useState(6); // Changed from 10 to 6
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetProductsQuery({ page, limit, search });
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
      } catch {
        alert('Failed to delete product. Make sure there are no related records.');
      }
    }
  };

  const openCreateModal = () => {
    if (!isAdmin) return;
    setEditProductId(null);
    setModalOpen(true);
  };

  const openEditModal = (id: string) => {
    if (!isAdmin) return;
    setEditProductId(id);
    setModalOpen(true);
  };

  const productImages = [
    '/images/products/product1.png',
    '/images/products/product2.png',
    '/images/products/product3.png',
    '/images/products/product4.png',
    '/images/products/product5.png',
    '/images/products/product6.png',
  ];

  if (isLoading) return <div className="p-4">Loading products...</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load products</div>;

  return (
    <div className="p-6"> {/* Removed min-h-screen and dark mode classes */}
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        {isAdmin && (
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 shadow-md transition-shadow"
          >
            + Create Product
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-4 w-full md:w-1/3">
        <input
          type="text"
          placeholder="Search products..."
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
              <th className="p-2 border-b text-center w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.products.map((product, index) => (
              <tr
                key={product.id}
                className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
              >
                {/* Image */}
                <td className="p-2 border-b flex justify-center">
                  <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-md border">
                    <Image
                      src={productImages[index % productImages.length]}
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
                <td className="p-2 border-b flex justify-center gap-2">
                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => openEditModal(product.id)}
                        className="px-3 py-1 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 shadow-md transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md transition"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400">Read-only</span>
                  )}
                </td>
              </tr>
            ))}
            {data?.products.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
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
          Page {data?.pagination.page} of {data?.pagination.totalPages}
        </span>
        <button
          disabled={page === data?.pagination.totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {modalOpen && <ProductModal productId={editProductId} onClose={() => setModalOpen(false)} />}
    </div>
  );
}