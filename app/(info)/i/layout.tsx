import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | App Nyumbani",
    default: "App Nyumbani",
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
    <div className="mx-auto max-w-2xl px-4 pb-6">
      {children}
    </div>
  );
}
