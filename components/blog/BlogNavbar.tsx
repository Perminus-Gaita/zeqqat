"use client";

import Link from "next/link";
import { Sun, Moon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface BlogNavbarProps {
  openLeftSidebar: boolean;
  onToggleSidebar: () => void;
}

type Theme = "light" | "dark";

export default function BlogNavbar({ openLeftSidebar, onToggleSidebar }: BlogNavbarProps) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <header className="fixed top-0 w-full h-12 flex items-center justify-between px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="h-8 w-8"
        >
          {openLeftSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        <Link
          href="/"
          className="flex items-center gap-2"
        >
          {/* Z Logo */}
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm leading-none">Z</span>
          </div>
          <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
            zeqqat
          </span>
        </Link>
      </div>

      <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
        {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>
    </header>
  );
}
