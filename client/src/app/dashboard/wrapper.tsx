'use client';

import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function DashboardWrapper({
  children,
  allowedRoles = ["USER", "ADMIN"],
}: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 dark:text-gray-200">
        Loading...
      </div>
    );
  }

  if (!session) return null;

  const role = (session.user as any)?.role;
  if (!allowedRoles.includes(role)) {
    return (
      <div className="p-6 text-center text-red-500">
        You do not have access to this page.
      </div>
    );
  }

  return <>{children}</>;
}