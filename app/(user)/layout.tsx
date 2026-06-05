import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserNavbar } from "@/components/user/navbar";

export const metadata: Metadata = { title: "To'yxona - Zallar" };

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-background">
      <UserNavbar />
      <main className="pt-16">{children}</main>
    </div>
  );
}
