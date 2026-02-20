import { Metadata } from "next";
import AdminClient from "./client";

export const metadata: Metadata = {
  title: "Admin - Zeqqat",
  description: "Admin panel for managing jackpot games and results",
};

export default function AdminPage() {
  return <AdminClient />;
}
