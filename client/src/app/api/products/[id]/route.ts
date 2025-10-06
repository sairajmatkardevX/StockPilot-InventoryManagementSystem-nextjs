import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from '@/lib/prisma';

// GET /api/products/[id] - Get product by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // ✅ CHANGED: Use NextAuth session instead of JWT
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { sales: true, purchases: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { message: 'Error retrieving product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product (admin only)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // ✅ CHANGED: Use NextAuth session instead of JWT
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ✅ CHANGED: Check admin role from session
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { name, price, rating, stockQuantity } = await request.json();

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (rating !== undefined) updateData.rating = rating ? parseFloat(rating) : null;
    if (stockQuantity !== undefined) updateData.stockQuantity = parseInt(stockQuantity);

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Update product error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: 'Error updating product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // ✅ CHANGED: Use NextAuth session instead of JWT
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ✅ CHANGED: Check admin role from session
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { sales: true, purchases: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.sales.length > 0 || product.purchases.length > 0) {
      return NextResponse.json(
        { message: 'Cannot delete product with related records' },
        { status: 400 }
      );
    }

    await prisma.product.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('Delete product error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: 'Error deleting product' },
      { status: 500 }
    );
  }
}