"use client";

import Link from "next/link";
import { BookOpen, Home } from "lucide-react";
import { usePathname } from "next/navigation";

interface BottomNavigationProps {
  openLeftSidebar: boolean;
  onToggleSidebar: () => void;
}

export default function BottomNavigation({ openLeftSidebar, onToggleSidebar }: BottomNavigationProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/i", icon: BookOpen, label: "Blogs" },
    { href: "/", icon: Home, label: "About" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
