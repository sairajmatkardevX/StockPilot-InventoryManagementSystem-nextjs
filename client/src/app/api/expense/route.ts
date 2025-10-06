import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from '@/lib/prisma';

// GET /api/expense - Get expenses by category (protected)
export async function GET() {
  try {
    // ✅ CHANGED: Use NextAuth session instead of JWT
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const expenseByCategorySummaryRaw = await prisma.expenseByCategory.findMany({
      orderBy: {
        date: 'desc',
      },
    });

    const expenseByCategorySummary = expenseByCategorySummaryRaw.map(
      (item) => ({
        ...item,
        amount: item.amount.toString(), // Convert Decimal to string
      })
    );

    return NextResponse.json(expenseByCategorySummary);
  } catch (error) {
    console.error('Get expenses error:', error);
    return NextResponse.json(
      { message: 'Error retrieving expenses by category' },
      { status: 500 }
    );
  }
}