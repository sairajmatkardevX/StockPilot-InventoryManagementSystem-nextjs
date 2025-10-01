
'use client';

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
  Building
} from "lucide-react";
import Image from "next/image";
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
  onClick 
}: SidebarLinkProps) => (
  <Link href={href} onClick={onClick}>
    <div
      className={`flex items-center gap-3 px-3 py-3 mx-2 rounded-lg transition-all duration-200 cursor-pointer group ${
        isCollapsed ? "justify-center" : "justify-start"
      } ${
        active 
          ? "bg-blue-600 text-white shadow-lg" 
          : "text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-transparent hover:border-blue-200"
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? "scale-110" : ""}`} />
      {!isCollapsed && (
        <span className="font-medium text-sm">{label}</span>
      )}
      
      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap shadow-lg">
          {label}
        </div>
      )}
    </div>
  </Link>
);

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-collapse on mobile
      if (mobile) {
        dispatch(setIsSidebarCollapsed(true));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const handleLinkClick = () => {
    if (isMobile) {
      dispatch(setIsSidebarCollapsed(true));
    }
  };

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

 const navigationItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/inventory", icon: Package, label: "Inventory" },
  { href: "/dashboard/products", icon: Building, label: "Products" },
  { href: "/dashboard/expenses", icon: DollarSign, label: "Expenses" },
  { href: "/dashboard/users", icon: Users, label: "Users" }, // Show to all users
  { href: "/dashboard/settings", icon: Settings, label: "Settings" }, // Show to all users
];

  if (isMobile && isSidebarCollapsed) {
    return null;
  }

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
        className={`fixed top-0 left-0 h-full z-50 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out shadow-xl ${
          isSidebarCollapsed ? "w-20" : "w-64"
        } ${
          isMobile && !isSidebarCollapsed ? "translate-x-0" : 
          isMobile && isSidebarCollapsed ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        {/* Header with Logo */}
        <div className={`flex items-center border-b border-gray-200 transition-all duration-300 ${
          isSidebarCollapsed ? "justify-center px-4" : "justify-between px-6"
        } py-5`}>
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-3">
              <Image 
                src="/images/logo.png" 
                alt="StockPilot" 
                width={36}
                height={36}
                style={{ width: 'auto', height: 'auto' }} // FIXED: Added auto aspect ratio
                className="rounded-lg"
              />
              <h1 className="text-xl font-bold text-gray-800">
                StockPilot
              </h1>
            </div>
          )}
          
          {isSidebarCollapsed && (
            <Image 
              src="/images/logo.png" 
              alt="StockPilot" 
              width={36}
              height={36}
              style={{ width: 'auto', height: 'auto' }} // FIXED: Added auto aspect ratio
              className="rounded-lg"
            />
          )}

          {/* Collapse Toggle - Desktop only */}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isCollapsed={isSidebarCollapsed}
              active={pathname === item.href || pathname.startsWith(item.href + '/')}
              onClick={handleLinkClick}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {!isSidebarCollapsed && (
            <div className="text-center">
              <p className="text-sm text-gray-700 font-medium mb-1">
                {session?.user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500">
                {session?.user?.role || "User"}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                © 2024 StockPilot
              </p>
            </div>
          )}
          {isSidebarCollapsed && (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-white">
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