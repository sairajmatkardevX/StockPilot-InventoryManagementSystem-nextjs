import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, requireAdmin } from '@/lib/auth';
import {prisma} from '@/lib/prisma';

// GET /api/users - Get all users (protected)
export async function GET(request: NextRequest) {
  try {
    const { user: currentUser, error } = await authenticateRequest(request);
    if (error || !currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    });

    const isAdmin = currentUser.role === "ADMIN";

    const mappedUsers = users.map(u => ({
      userId: u.id,
      name: u.name,
      role: u.role,
      ...(isAdmin && { email: u.email }), // email only for admin
    }));

    return NextResponse.json(mappedUsers);
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create user (admin only)
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request);
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!requireAdmin(user)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { name, email, password, role } = await request.json();
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    return NextResponse.json({
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { message: 'Email already exists or invalid data' },
      { status: 400 }
    );
  }
}