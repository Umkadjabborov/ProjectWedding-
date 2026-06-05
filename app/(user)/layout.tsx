import type { Metadata } from "next";
import { UserNavbar } from "@/components/user/navbar";

export const metadata: Metadata = { title: "To'yxona - Zallar" };

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />
      <main className="pt-16">{children}</main>
    </div>
  );
}
