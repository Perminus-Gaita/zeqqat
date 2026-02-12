"use client";

import Link from "next/link";
import { BookOpen, Home, HelpCircle } from "lucide-react";
import { usePathname } from "next/navigation";

interface LeftSideBarProps {
  openLeftSidebar: boolean;
  onClose: () => void;
}

export default function LeftSideBar({ openLeftSidebar, onClose }: LeftSideBarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home, label: "About" },
    { href: "/i", icon: BookOpen, label: "Blogs" },
    { href: "/support", icon: HelpCircle, label: "Support" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
          App Nyumbani
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} App Nyumbani
        </p>
      </div>
    </div>
  );
}
