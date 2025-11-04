"use client";

import { signOut, useSession } from "next-auth/react";
import { useAppSelector, useAppDispatch } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { Menu, Sun, Moon, LogOut } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";

const profileImages = [
  "/images/users/user1.png",
  "/images/users/user2.png",
  "/images/users/user3.png",
  "/images/users/user4.png",
  "/images/users/user5.png",
];

export default function Navbar() {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const { data: session } = useSession();
  const user = session?.user;
  const { theme, setTheme } = useTheme();

  const randomProfileImage =
    profileImages[Math.floor(Math.random() * profileImages.length)];

  const toggleSidebar = () =>
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header className="h-16 bg-background border-b sticky top-0 z-40">
      <div className="flex justify-between items-center h-full px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Name */}
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Profile Image */}
          <div className="flex items-center gap-2">
            <Image
              src={user?.image || randomProfileImage}
              alt={user?.name || "User"}
              width={32}
              height={32}
              className="rounded-full object-cover border-2 border-border"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-foreground">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role?.toLowerCase() || "user"}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
