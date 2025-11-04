'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useGetProductsQuery, useDeleteProductMutation } from '@/state/api';
import ProductModal from './ProductModal';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../../components/ui/alert-dialog";

export default function ProductsPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetProductsQuery({ page, limit, search });
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    try {
      await deleteProduct(id).unwrap();
    } catch {
      alert('Failed to delete product. Make sure there are no related records.');
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
            <div className="text-destructive text-lg font-semibold">Failed to load products</div>
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Product Management</CardTitle>
            <CardDescription>Manage your product catalog</CardDescription>
          </div>
          {isAdmin && (
            <Button onClick={openCreateModal}>
              + Create Product
            </Button>
          )}
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
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.products.map((product, index) => (
                <TableRow key={product.id} className="hover:bg-accent/50">
                  <TableCell>
                    <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-md border">
                      <Image
                        src={productImages[index % productImages.length]}
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
                      {product.stockQuantity} units
                    </Badge>
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
                  <TableCell className="text-center">
                    {isAdmin ? (
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(product.id)}
                        >
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the product
                                "{product.name}" from the system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Read-only
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {data?.products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
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

      {/* Modal */}
      {modalOpen && <ProductModal productId={editProductId} onClose={() => setModalOpen(false)} />}
    </div>
  );
}