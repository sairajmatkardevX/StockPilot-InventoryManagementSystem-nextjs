import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

// TEMPORARY HARCODED DATABASE FOR DEMO
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgres://bc426524577fb0f28585900493803037d2bac9c56bf1a2fb74d827635b3f2537:sk_7ou8QqGy5gUvszaFbp5ko@db.prisma.io:5432/postgres?sslmode=require'
    }
  }
});

export async function POST(request: NextRequest) {
  try {
    console.log('=== LOGIN API CALLED ==='); // DEBUG
    const { email, password } = await request.json();
    console.log('Email:', email); // DEBUG

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('Searching for user...'); // DEBUG
    const user = await prisma.user.findUnique({ where: { email } });
    console.log('User found:', user); // DEBUG

    if (!user) {
      console.log('User not found'); // DEBUG
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('Checking password...'); // DEBUG
    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValid); // DEBUG

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('Generating token...'); // DEBUG
    const token = generateToken({
      id: user.id,
      role: user.role as 'ADMIN' | 'USER'
    });

    console.log('Login successful for:', email); // DEBUG
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error); // This should show the actual error
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}