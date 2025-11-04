'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useGetProductsQuery } from '@/state/api';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
  image?: string;
}

export default function InventoryPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
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

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-1/3" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="m-6">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-destructive text-lg font-semibold">Failed to load inventory</div>
            <div className="text-muted-foreground mt-2">Please try again later</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStockBadgeVariant = (quantity: number) => {
    if (quantity === 0) return "destructive";
    if (quantity < 10) return "secondary";
    return "default";
  };

  const getStockBadgeText = (quantity: number) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity < 10) return "Low Stock";
    return "In Stock";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Management</CardTitle>
          <CardDescription>Manage and view your product inventory</CardDescription>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Products</CardTitle>
          <CardDescription>
            {data?.pagination?.totalItems || 0} products found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-right">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="hover:bg-accent/50">
                  <TableCell>
                    <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-md border">
                      <Image
                        src={product.image || '/images/products/product1.png'}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-right">₹{product.price}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStockBadgeVariant(product.stockQuantity)}>
                      {getStockBadgeText(product.stockQuantity)}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {product.stockQuantity} units
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {product.rating ? (
                      <div className="flex items-center justify-end gap-1">
                        <span className="font-medium">{product.rating}</span>
                        <span className="text-muted-foreground">/5</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="text-muted-foreground">
                      No products found matching your search
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <Card>
          <CardContent className="flex justify-between items-center py-4">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Page</span>
              <Badge variant="secondary">
                {data.pagination.page} of {data.pagination.totalPages}
              </Badge>
              <span className="text-muted-foreground">
                ({data.pagination.totalItems} total items)
              </span>
            </div>
            <Button
              variant="outline"
              disabled={page === data.pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}