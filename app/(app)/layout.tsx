import { ReactNode } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { SidebarProvider } from "@/lib/stores/sidebar-store";

interface AppLayoutWrapperProps {
  children: ReactNode;
}

export default function AppLayoutWrapper({ children }: AppLayoutWrapperProps) {
  return (
    <SidebarProvider>
      <AppLayout>{children}</AppLayout>
    </SidebarProvider>
  );
}
