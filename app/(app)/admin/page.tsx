import { Metadata } from "next";
import AdminClient from "./client";

export const metadata: Metadata = {
  title: "Admin - App Nyumbani",
  description: "Admin panel for managing jackpot games and results",
};

export default function AdminPage() {
  return <AdminClient />;
}
