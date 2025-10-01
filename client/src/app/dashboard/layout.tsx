'use client';

import Navbar from "@/app/(components)/Navbar";
import Sidebar from "@/app/(components)/Sidebar";
import { useAppSelector } from "@/app/redux";
import DashboardWrapper from "./wrapper";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  return (
    <DashboardWrapper allowedRoles={["USER", "ADMIN"]}>
      <div className={`flex min-h-screen w-full ${isDarkMode ? "dark bg-gray-900 text-white" : "light bg-gray-50 text-gray-900"}`}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? "md:ml-16" : "md:ml-64"}`}>
          {/* Navbar - sticky at top */}
          <div className="sticky top-0 z-30 flex-shrink-0">
            <Navbar />
          </div>

          {/* Page content - NO SCROLLBAR */}
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </DashboardWrapper>
  );
}