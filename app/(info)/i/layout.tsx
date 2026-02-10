import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | App Nyumbani Blog",
    default: "Blog | App Nyumbani",
  },
  description:
    "Data-driven betting research insights, strategies, and analysis.",
};

export default function BlogContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl py-6">
      {children}
    </div>
  );
}
