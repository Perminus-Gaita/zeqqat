"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import BlogNavbar from "@/components/blog/BlogNavbar";
import BlogLeftSideBar from "@/components/blog/BlogLeftSideBar";
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

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  const [openLeftSidebar, setOpenLeftSidebar] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery("(max-width:639px)");
  const isTablet = useMediaQuery("(min-width:640px) and (max-width:1023px)");

  useEffect(() => {
    if (!isMobile && !isTablet) {
      setOpenLeftSidebar(true);
    }
  }, [isMobile, isTablet]);

  const toggleSidebar = () => {
    setOpenLeftSidebar(!openLeftSidebar);
  };

  const getSidebarStyles = () => {
    const deviceType = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
    const state: keyof DeviceWidths[typeof deviceType] = openLeftSidebar ? "open" : "closed";

    const sidebarWidth = SIDEBAR_WIDTHS[deviceType][state];
    const marginLeft = deviceType === "desktop" ? (openLeftSidebar ? "ml-64" : "ml-16") : "ml-0";

    return {
      sidebar: sidebarWidth,
      content: marginLeft,
    };
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <BlogNavbar
        openLeftSidebar={openLeftSidebar}
        onToggleSidebar={toggleSidebar}
      />

      <div className="flex relative flex-1">
        {/* Overlay */}
        {openLeftSidebar && (isMobile || isTablet) && (
          <div
            className="fixed inset-0 bg-black/50 z-20"
            onClick={() => setOpenLeftSidebar(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className={`
            fixed top-12 left-0 h-[calc(100vh-3rem)] z-30
            border-r border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            transition-all duration-300 ease-in-out
            ${!openLeftSidebar && (isMobile || isTablet) ? "-translate-x-full" : "translate-x-0"}
            ${getSidebarStyles().sidebar}
            ${isMobile || isTablet ? "shadow-xl" : ""}
          `}
        >
          <BlogLeftSideBar
            openLeftSidebar={openLeftSidebar}
            onClose={() => setOpenLeftSidebar(false)}
          />
        </aside>

        {/* Main Content + Footer */}
        <div
          className={`
            flex-1 flex flex-col min-h-screen
            transition-all duration-300
            ${getSidebarStyles().content}
          `}
        >
          <main className="flex-1 px-4 pb-8">
            {children}
          </main>

          {/* Footer on every blog page */}
          <footer className="border-t border-gray-200 dark:border-gray-800">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-8">
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Categories
                  </h3>
                  <nav className="flex flex-col gap-2">
                    <Link href="/i/category/strategies" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Strategies
                    </Link>
                    <Link href="/i/category/analysis" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Analysis
                    </Link>
                    <Link href="/i/category/guides" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Guides
                    </Link>
                  </nav>
                </div>

                {/* Resources */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Resources
                  </h3>
                  <nav className="flex flex-col gap-2">
                    <Link href="/i" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      All Articles
                    </Link>
                    <Link href="/support" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Support
                    </Link>
                  </nav>
                </div>

                {/* About */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    App Nyumbani
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Data-driven betting research tools. Define your logic, test it with data.
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  © {new Date().getFullYear()} App Nyumbani. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
