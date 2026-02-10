import { ReactNode } from "react";
import BlogLayout from "@/components/blog/BlogLayout";

interface InfoLayoutProps {
  children: ReactNode;
}

export default function InfoLayout({ children }: InfoLayoutProps) {
  return <BlogLayout>{children}</BlogLayout>;
}
