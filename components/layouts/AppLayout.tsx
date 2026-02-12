"use client";

import { useState, useEffect } from "react";
import LeftSideBar from "@/components/navigation/LeftSideBar";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [openLeftSidebar, setOpenLeftSidebar] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");

  const toggleSidebar = () => setOpenLeftSidebar(!openLeftSidebar);

  useEffect(() => {
    if (!isMobile && !isTablet) {
      setOpenLeftSidebar(false);
    }
  }, [isMobile, isTablet]);

  const getSidebarStyles = () => {
    if (isMobile || isTablet) {
      return {
        sidebar: "w-64 fixed left-0 top-0 bottom-0 bg-white dark:bg-gray-900 z-50",
        content: "ml-0",
      };
    }
    return {
      sidebar: "w-64 fixed left-0 top-0 bottom-0 bg-white dark:bg-gray-900",
      content: "ml-64",
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {(isMobile || isTablet) && openLeftSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpenLeftSidebar(false)}
        />
      )}

      <div className="flex">
        <aside
          className={`
            transition-transform duration-300 ease-in-out
            ${openLeftSidebar ? "translate-x-0" : "-translate-x-full"}
            ${getSidebarStyles().sidebar}
            ${isMobile || isTablet ? "shadow-xl" : ""}
          `}
        >
          <LeftSideBar
            openLeftSidebar={openLeftSidebar}
            onClose={() => setOpenLeftSidebar(false)}
          />
        </aside>

        <main className={`
          flex-1 px-4 pb-20 md:pb-4 min-h-screen
          transition-all duration-300
          ${getSidebarStyles().content}
        `}>
          {children}
        </main>
      </div>

      <BottomNavigation
        openLeftSidebar={openLeftSidebar}
        onToggleSidebar={toggleSidebar}
      />
    </div>
  );
}
