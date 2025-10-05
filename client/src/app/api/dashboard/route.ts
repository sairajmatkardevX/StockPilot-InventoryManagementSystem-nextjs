import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const { user, error } = await authenticateRequest(request);
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Top 15 popular products by stockQuantity
    const popularProducts = await prisma.product.findMany({
      take: 15,
      orderBy: { stockQuantity: 'desc' },
    });

    // Last 5 sales
    const salesSummary = await prisma.salesSummary.findMany({
      take: 5,
      orderBy: { date: 'desc' },
    });

    // Last 5 purchases
    const purchaseSummary = await prisma.purchaseSummary.findMany({
      take: 5,
      orderBy: { date: 'desc' },
    });

    // Last 5 expenses
    const expenseSummary = await prisma.expenseSummary.findMany({
      take: 5,
      orderBy: { date: 'desc' },
    });

    // Last 5 expense by category
    const expenseByCategorySummaryRaw = await prisma.expenseByCategory.findMany({
      take: 5,
      orderBy: { date: 'desc' },
    });

    // Convert bigint amounts to string for JSON
    const expenseByCategorySummary = expenseByCategorySummaryRaw.map((item) => ({
      ...item,
      amount: item.amount.toString(),
    }));

    return NextResponse.json({
      popularProducts,
      salesSummary,
      purchaseSummary,
      expenseSummary,
      expenseByCategorySummary,
    });
  } catch (error) {
    console.error('Error retrieving dashboard metrics:', error);
    return NextResponse.json(
      { message: 'Error retrieving dashboard metrics' },
      { status: 500 }
    );
  }
}