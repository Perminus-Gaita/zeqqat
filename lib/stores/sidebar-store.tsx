"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
  openLeftSidebar: boolean;
  setOpenLeftSidebar: (open: boolean) => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [openLeftSidebar, setOpenLeftSidebar] = useState<boolean>(true);

  const toggleSidebar = () => {
    setOpenLeftSidebar(prev => !prev);
  };

  return (
    <SidebarContext.Provider value={{ openLeftSidebar, setOpenLeftSidebar, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
