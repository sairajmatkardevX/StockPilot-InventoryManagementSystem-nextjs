"use client";

import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import React from "react";
import Rating from "../../../components/Rating";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Popular Products</CardTitle>
          <CardDescription>Most popular items by sales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-center py-8">No products found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle>Popular Products</CardTitle>
        <CardDescription>Most popular items by sales</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {products.slice(0, 6).map((product, index) => (
          <div
            key={product.id}
            className="flex justify-between items-center p-3 rounded-lg hover:bg-accent transition-colors"
          >
            {/* Left side with image + info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Image
                src={`/images/products/product${index + 1}.png`}
                alt={product.name}
                width={48}
                height={48}
                className="rounded-md object-cover w-12 h-12 flex-shrink-0"
              />
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <span className="font-semibold text-foreground truncate">
                  {product.name}
                </span>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-primary font-bold">
                    ${product.price}
                  </span>
                  <Rating rating={product.rating || 0} />
                </div>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 text-xs flex-shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ShoppingBag className="w-4 h-4" />
              </Button>
              <Badge variant="secondary">
                {formatSold(product.stockQuantity)}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CardPopularProducts;