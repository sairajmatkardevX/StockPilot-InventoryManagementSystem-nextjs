import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import {prisma} from '@/lib/prisma';

// GET /api/expense - Get expenses by category (protected)
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const { user, error } = await authenticateRequest(request);
    if (error || !user) {
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