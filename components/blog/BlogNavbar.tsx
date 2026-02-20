"use client";

import Link from "next/link";
import { Menu, X, Sun, Moon, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { usePicksStore } from "@/lib/stores/picks-store";

interface BlogNavbarProps {
  openLeftSidebar: boolean;
  onToggleSidebar: () => void;
}

type Theme = "light" | "dark";

export default function BlogNavbar({ openLeftSidebar, onToggleSidebar }: BlogNavbarProps) {
  const [theme, setTheme] = useState<Theme>("dark");

  // Picks store
  const { picks, isDrawerOpen, toggleDrawer } = usePicksStore();
  const picksCount = picks.length;

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "dark";
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
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="h-8 w-8"
        >
          {openLeftSidebar ? (
            <X className="h-5 w-5 text-gray-900 dark:text-white" />
          ) : (
            <Menu className="h-5 w-5 text-gray-900 dark:text-white" />
          )}
        </Button>

        <Link href="/jackpots" className="text-lg font-bold text-gray-900 dark:text-white">
          App Nyumbani
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {/* Picks Betslip Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDrawer}
          className="h-8 w-8 relative"
        >
          <ScrollText className="h-5 w-5 text-gray-900 dark:text-white" />
          {picksCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {picksCount > 99 ? "99+" : picksCount}
            </span>
          )}
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-gray-900 dark:text-white" />
          ) : (
            <Moon className="h-5 w-5 text-gray-900 dark:text-white" />
          )}
        </Button>
      </div>
    </header>
  );
}
