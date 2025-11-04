"use client";

import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardWrapperProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function DashboardWrapper({
  children,
  allowedRoles = ["USER", "ADMIN"],
}: DashboardWrapperProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect if unauthenticated
    if (status === "unauthenticated") {
      router.replace("/login"); // use replace() to prevent navigation history issues
    }
  }, [status, router]);

  // ⏳ Loading state
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-80 text-center">
          <CardHeader>
            <CardTitle>Loading</CardTitle>
            <CardDescription>Please wait...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded animate-pulse w-2/3 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 🚫 No session found
  if (!session) return null;

  const role = (session.user as any)?.role;

  // ❌ Access denied state
  if (!allowedRoles.includes(role)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-96 text-center border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>
              Your role: <strong>{role ?? "Unknown"}</strong>
            </p>
            <p className="text-sm">
              Required roles: {allowedRoles.join(", ")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ Authorized view
  return <>{children}</>;
}
