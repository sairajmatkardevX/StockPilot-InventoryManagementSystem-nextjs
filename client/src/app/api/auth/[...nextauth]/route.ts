import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Direct database authentication - no API calls
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user) {
            console.warn("[NextAuth] User not found:", credentials.email);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            console.warn("[NextAuth] Invalid password for:", credentials.email);
            return null;
          }

          console.log("[NextAuth] Login successful for:", credentials.email);
          
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as "ADMIN" | "USER",
          };
        } catch (err) {
          console.error("[NextAuth] authorize error:", err);
          return null;
        }
      },
    }),
  ],

  session: { 
    strategy: "jwt",
    maxAge: 10 * 60 , // 24 hours
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as "ADMIN" | "USER";
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    signOut: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// Type extensions
declare module "next-auth" {
  interface User {
    role: 'ADMIN' | 'USER';
  }
  
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: 'ADMIN' | 'USER';
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: 'ADMIN' | 'USER';
    id: string;
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };