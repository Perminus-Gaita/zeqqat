"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LeftSideBar from "@/components/navigation/LeftSideBar";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface DeviceWidths {
  mobile: { open: string; closed: string };
  tablet: { open: string; closed: string };
  desktop: { open: string; closed: string };
}

const SIDEBAR_WIDTHS: DeviceWidths = {
  mobile: { open: "w-64", closed: "w-0" },
  tablet: { open: "w-64", closed: "w-0" },
  desktop: { open: "w-64", closed: "w-16" },
};

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  const [openLeftSidebar, setOpenLeftSidebar] = useState(false);
  const isMobile = useMediaQuery("(max-width:639px)");
  const isTablet = useMediaQuery("(min-width:640px) and (max-width:1023px)");

  const toggleSidebar = () => setOpenLeftSidebar(!openLeftSidebar);

  // Auto-open sidebar on desktop, close on mobile/tablet
  useEffect(() => {
    if (!isMobile && !isTablet) {
      setOpenLeftSidebar(true);
    } else {
      setOpenLeftSidebar(false);
    }
  }, [isMobile, isTablet]);

  // Set dark theme as default
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (!savedTheme) {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const getSidebarStyles = () => {
    const deviceType = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
    const state: keyof DeviceWidths[typeof deviceType] = openLeftSidebar ? "open" : "closed";
    const sidebarWidth = SIDEBAR_WIDTHS[deviceType][state];
    const marginLeft = deviceType === "desktop" ? (openLeftSidebar ? "ml-64" : "ml-16") : "ml-0";
    return { sidebar: sidebarWidth, content: marginLeft };
  };

  // Landing page: no sidebar
  if (isLandingPage) {
    return (
      <div className="min-h-screen">
        <main className="px-4 pb-4 min-h-screen">
          {children}
        </main>
        <BottomNavigation
          openLeftSidebar={openLeftSidebar}
          onToggleSidebar={toggleSidebar}
        />
      </div>
    );
  }

  // Other pages: with sidebar
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {openLeftSidebar && (isMobile || isTablet) && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setOpenLeftSidebar(false)}
        />
      )}

      <div className="flex relative">
        <aside
          className={`
            fixed top-0 left-0 h-screen z-30
            border-r border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            transition-all duration-300 ease-in-out
            ${!openLeftSidebar && (isMobile || isTablet) ? "-translate-x-full" : "translate-x-0"}
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
