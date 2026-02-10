"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Headset } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

interface BlogLeftSideBarProps {
  openLeftSidebar: boolean;
  onClose: () => void;
}

export default function BlogLeftSideBar({ openLeftSidebar, onClose }: BlogLeftSideBarProps) {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width:639px)");
  const isTablet = useMediaQuery("(min-width:640px) and (max-width:1023px)");

  const handleClick = () => {
    if (isMobile || isTablet) {
      onClose();
    }
  };

  const isSupportActive = pathname === "/support";

  return (
    <aside className="h-full overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col h-full">
        {/* Empty top area */}
        <div className="flex-1" />

        {/* Bottom section - matches app sidebar structure */}
        <div className="py-4 border-t border-gray-200 dark:border-gray-800">
          {/* Support */}
          <Link
            href="/support"
            onClick={handleClick}
            className={cn(
              "flex items-center justify-start h-12 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 overflow-hidden transition-all duration-300 ease-in-out",
              isSupportActive
                ? "bg-gray-100 dark:bg-gray-800 text-blue-600"
                : "text-gray-700 dark:text-gray-300",
              openLeftSidebar ? "px-3" : "pl-[1.375rem]"
            )}
          >
            <Headset className="h-5 w-5 flex-shrink-0" />
            <span
              className={cn(
                "whitespace-nowrap transition-all duration-300 ease-in-out",
                openLeftSidebar
                  ? "opacity-100 ml-3 max-w-xs"
                  : "opacity-0 ml-0 max-w-0"
              )}
            >
              Support
            </span>
          </Link>

          {/* Empty placeholder where Settings would be */}
          <div className="h-12" />
        </div>
      </div>
    </aside>
  );
}
