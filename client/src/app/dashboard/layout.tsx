'use client';

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAppSelector } from "@/app/redux";
import DashboardWrapper from "./wrapper";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  return (
    <DashboardWrapper allowedRoles={["USER", "ADMIN"]}>
      <div className="flex min-h-screen w-full bg-background text-foreground transition-colors">
        {/* Sidebar */}
        <aside className="flex-shrink-0">
          <Sidebar />
        </aside>

        {/* Main Section */}
        <div
          className={`flex flex-1 flex-col transition-[margin] duration-300 ${
            isSidebarCollapsed ? "md:ml-16" : "md:ml-64"
          }`}
        >
          {/* Navbar */}
          <header className="sticky top-0 z-30 flex-shrink-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
            <Navbar />
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-hidden p-4">{children}</main>
        </div>
      </div>
    </DashboardWrapper>
  );
}