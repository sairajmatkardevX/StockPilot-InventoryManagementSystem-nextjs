"use client";

import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import React from "react";
import Rating from "@/app/(components)/Rating";

interface Product {
  id: string;
  name: string;
  price: number;
  rating?: number | null;
  stockQuantity: number;
}

interface CardPopularProductsProps {
  products: Product[];
}

const CardPopularProducts = ({ products }: CardPopularProductsProps) => {
  const formatSold = (stockQuantity: number) => {
    if (stockQuantity >= 1000) {
      return `${Math.round(stockQuantity / 1000)}k Sold`;
    }
    return `${stockQuantity} Sold`;
  };

  if (!products || products.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 h-full">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Popular Products
        </h2>
        <hr className="border-gray-200 dark:border-gray-700 mb-4" />
        <div className="text-gray-500 dark:text-gray-300">No products found</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 flex flex-col hover:shadow-lg transition-shadow duration-200 h-full">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
        Popular Products
      </h2>
      <hr className="border-gray-200 dark:border-gray-700 mb-4" />

      {/* List of products */}
      <div className="flex flex-col gap-4">
        {products.slice(0, 6).map((product, index) => (
          <div
            key={product.id}
            className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {/* Left side with image + info */}
            <div className="flex items-center gap-3">
              <Image
                src={`/images/products/product${index + 1}.png`}
                alt={product.name}
                width={48}
                height={48}
                className="rounded-md object-cover w-12 h-12"
              />
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  {product.name}
                </span>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-blue-500 font-bold">
                    ${product.price}
                  </span>
                  <Rating rating={product.rating || 0} />
                </div>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 text-xs">
              <button className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                <ShoppingBag className="w-4 h-4" />
              </button>
              <span>{formatSold(product.stockQuantity)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardPopularProducts;