"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import {
  LayoutDashboard,
  Package,
  DollarSign,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building,
  Boxes, // 👈 using this as the logo icon (you can change)
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface SidebarLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
  active: boolean;
  onClick?: () => void;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
  active,
  onClick,
}: SidebarLinkProps) => (
  <Link href={href} onClick={onClick}>
    <div
      className={`flex items-center gap-3 px-3 py-3 mx-2 rounded-lg transition-all duration-200 cursor-pointer group relative ${
        isCollapsed ? "justify-center" : "justify-start"
      } ${
        active
          ? "bg-primary text-primary-foreground shadow-lg"
          : "text-foreground hover:bg-accent hover:text-accent-foreground border border-transparent hover:border-border"
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? "scale-110" : ""}`} />
      {!isCollapsed && <span className="font-medium text-sm">{label}</span>}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap shadow-lg border">
          {label}
        </div>
      )}
    </div>
  </Link>
);

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const { data: session } = useSession();
  const pathname = usePathname();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Auto-collapse on mobile
      if (mobile) dispatch(setIsSidebarCollapsed(true));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const handleLinkClick = () => {
    if (isMobile) dispatch(setIsSidebarCollapsed(true));
  };

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const navigationItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/inventory", icon: Package, label: "Inventory" },
    { href: "/dashboard/products", icon: Building, label: "Products" },
    { href: "/dashboard/expenses", icon: DollarSign, label: "Expenses" },
    { href: "/dashboard/users", icon: Users, label: "Users" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  if (isMobile && isSidebarCollapsed) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => dispatch(setIsSidebarCollapsed(true))}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-background border-r border-border flex flex-col transition-all duration-300 ease-in-out shadow-xl overflow-y-auto overflow-x-hidden ${
          isSidebarCollapsed ? "w-20" : "w-64"
        } ${
          isMobile && !isSidebarCollapsed
            ? "translate-x-0"
            : isMobile && isSidebarCollapsed
            ? "-translate-x-full"
            : "translate-x-0"
        }`}
      >
        {/* Header with built-in icon instead of image */}
        <div
          className={`flex items-center border-b border-border transition-all duration-300 ${
            isSidebarCollapsed ? "justify-center px-4" : "justify-between px-6"
          } py-5`}
        >
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <Boxes className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                StockPilot
              </h1>
            </div>
          ) : (
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Boxes className="w-5 h-5 text-primary-foreground" />
            </div>
          )}

          {/* Collapse Toggle (desktop only) */}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg hover:bg-accent transition-colors"
              aria-label={
                isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
          {navigationItems.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isCollapsed={isSidebarCollapsed}
              active={
                pathname === item.href || pathname.startsWith(item.href + "/")
              }
              onClick={handleLinkClick}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          {!isSidebarCollapsed ? (
            <div className="text-center">
              <p className="text-sm text-foreground font-medium mb-1">
                {session?.user?.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground">
                {session?.user?.role || "User"}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                © 2024 StockPilot
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-primary-foreground">
                  {(session?.user?.name?.[0] || "U").toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
