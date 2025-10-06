import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET /api/users/[id] - Get user by ID (admin only)
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

    // ✅ CHANGED: Check admin role from session
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { message: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!userData) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      userId: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user (admin only)
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

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { message: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const { name, email, password, role } = await request.json();

    const updateData: any = { name, email, role };
    if (password) {
      // ✅ CHANGED: Use direct bcrypt import
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      userId: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { message: 'Failed to update user' },
      { status: 400 }
    );
  }
}

// DELETE /api/users/[id] - Delete user (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Use NextAuth session instead of JWT
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ✅ CHANGED: Check admin role from session
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { message: 'Invalid user ID' },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id: userId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { message: 'Failed to delete user' },
      { status: 400 }
    );
  }
}