import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();

    // Validation (same as Express)
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists (same as Express)
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: 'Email already in use' },
        { status: 400 }
      );
    }

    // Hash password (same as Express)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (same as Express)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role?.toUpperCase() === "ADMIN" ? "ADMIN" : "USER",
      },
    });

    // Generate JWT (using our utility)
    const token = generateToken({
      id: newUser.id,
      role: newUser.role as 'ADMIN' | 'USER'
    });

    // Return response (same structure as Express)
    return NextResponse.json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}