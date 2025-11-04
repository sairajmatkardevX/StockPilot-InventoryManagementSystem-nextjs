'use client';

import React, { useEffect, useState } from 'react';
import { useCreateProductMutation, useUpdateProductMutation, useGetProductQuery } from '@/state/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";

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
  });

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
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{productId ? 'Edit Product' : 'Create Product'}</DialogTitle>
          <DialogDescription>
            {productId ? 'Update the product details below.' : 'Add a new product to your inventory.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">Rating (1–5)</Label>
            <Input
              id="rating"
              name="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={handleChange}
              placeholder="4.5"
            />
          </div>

          {/* Stock Quantity */}
          <div className="space-y-2">
            <Label htmlFor="stockQuantity">Stock Quantity</Label>
            <Input
              id="stockQuantity"
              name="stockQuantity"
              type="number"
              min="0"
              value={formData.stockQuantity}
              onChange={handleChange}
              placeholder="100"
              required
            />
          </div>

          {/* Footer Buttons */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {productId ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
