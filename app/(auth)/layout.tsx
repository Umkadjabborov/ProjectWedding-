import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Akkount boshqaruvi",
};

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session) {
    const role = session.user.role;
    if (role === "ADMIN") redirect("/admin/dashboard");
    if (role === "OWNER") redirect("/owner/dashboard");
    redirect("/halls");
  }

  return <>{children}</>;
}
