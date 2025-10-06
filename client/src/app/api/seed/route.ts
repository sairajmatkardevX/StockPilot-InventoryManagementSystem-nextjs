// app/api/seed/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ✅ BEST: Hardcoded users array
const usersData = [
  {
    name: "System Administrator",
    email: "admin@stockpilot.com",
    password: "Admin@123",
    role: "ADMIN" as const
  },
  {
    name: "Demo User",
    email: "user@stockpilot.com", 
    password: "User@123",
    role: "USER" as const
  },
  {
    name: "Manager Account",
    email: "manager@stockpilot.com",
    password: "Manager@123", 
    role: "USER" as const
  }
];

export async function GET() {
  try {
    const results = [];
    
    for (const userData of usersData) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          password: hashedPassword,
          name: userData.name,
          role: userData.role
        },
        create: {
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
          role: userData.role
        }
      });
      
      results.push({
        email: user.email,
        name: user.name,
        role: user.role,
        password: userData.password // Show for demo
      });
    }

    return NextResponse.json({ 
      success: true,
      message: `✅ ${results.length} users seeded successfully!`,
      users: results,
      note: "Delete this route after use for security"
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    });
  }
}