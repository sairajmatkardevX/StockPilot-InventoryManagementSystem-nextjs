import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from '@/lib/prisma';

// GET /api/products - Get all products (protected)
export async function GET(request: Request) {
  try {
    // ✅ CHANGED: Use NextAuth session instead of JWT
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const whereCondition: any = {};
    if (search) {
      whereCondition.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { id: { contains: search } },
      ];
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: { sales: true, purchases: true },
      }),
      prisma.product.count({ where: whereCondition }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { message: 'Error retrieving products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create product (admin only)
export async function POST(request: Request) {
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

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        rating: rating ? parseFloat(rating) : null,
        stockQuantity: parseInt(stockQuantity),
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { message: 'Error creating product' },
      { status: 500 }
    );
  }
}