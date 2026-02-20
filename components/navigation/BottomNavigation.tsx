"use client";

import Link from "next/link";
import { Home, BookOpen, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { usePicksStore } from "@/lib/stores/picks-store";

interface BottomNavigationProps {
  openLeftSidebar: boolean;
  onToggleSidebar: () => void;
}

export default function BottomNavigation({ openLeftSidebar, onToggleSidebar }: BottomNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40">
      <div className="flex items-center justify-around h-16">
        <Link
          href="/jackpots"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            pathname === "/jackpots"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Nyumbani</span>
        </Link>

        <Link
          href="/i"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            pathname?.startsWith("/i")
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          <BookOpen className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Blogs</span>
        </Link>

        <button
          onClick={onToggleSidebar}
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            openLeftSidebar
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          <Menu className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">More</span>
        </button>
      </div>
    </nav>
  );
}
