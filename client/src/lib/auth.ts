import jwt from "jsonwebtoken";
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JWTPayload {
  id: string;
  role: 'ADMIN' | 'USER';
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export async function authenticateRequest(request: NextRequest): Promise<{ user: JWTPayload | null; error: string | null }> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return { user: null, error: 'Unauthorized' };
    }

    const decoded = verifyToken(token);
    return { user: decoded, error: null };
  } catch (error) {
    return { user: null, error: 'Invalid token' };
  }
}

export function requireAdmin(user: JWTPayload): boolean {
  return user.role === 'ADMIN';
}