
'use client';

import { useState, useMemo } from "react";
import { signOut, useSession } from "next-auth/react";
import { useAppSelector, useAppDispatch } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { 
  Menu, Bell, Settings, LogOut, User, Search, ChevronDown 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const { data: session } = useSession();
  const user = session?.user;

  const profileImages = [
    "/images/users/user1.png",
    "/images/users/user2.png",
    "/images/users/user3.png",
    "/images/users/user4.png",
    "/images/users/user5.png",
  ];

  const randomProfileImage = useMemo(
    () => profileImages[Math.floor(Math.random() * profileImages.length)],
    []
  );

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleSidebar = () => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));

  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="flex justify-between items-center h-full px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle */}
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search inventory, products..."
              className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button 
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
              3
            </span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="User menu"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={user?.image || randomProfileImage}
                  alt={user?.name || 'Guest'}
                  width={32}
                  height={32}
                  className="rounded-full object-cover border-2 border-gray-200"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || "Guest"}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role?.toLowerCase() || "user"}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-12 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.name || "Guest"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
                
                {/* Menu Items */}
                <div className="py-2">
                  <Link 
                    href="/dashboard/settings" 
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  
                  <Link 
                    href="/dashboard/profile" 
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </div>

                {/* Logout */}
                <div className="pt-2 border-t border-gray-200">
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/login" });
                      setIsProfileOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}