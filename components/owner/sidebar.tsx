"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Building2, CalendarCheck, LogOut, Crown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/owner/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/owner/my-hall", label: "Mening zalim", icon: Building2 },
  { href: "/owner/bookings", label: "Bronlar", icon: CalendarCheck },
];

export function OwnerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 h-full w-64 flex flex-col bg-navy border-r border-white/5">
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-gold">
          <Crown className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="font-playfair font-bold text-white text-sm">To&apos;yxona</p>
          <p className="text-white/40 text-xs">Ega paneli</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                active
                  ? "bg-gradient-to-r from-gold/20 to-gold/5 text-gold border border-gold/20"
                  : "text-white/50 hover:text-white hover:bg-white/8"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", active ? "text-gold" : "text-white/40 group-hover:text-white")} />
              <span>{label}</span>
              {active && <ChevronRight className="h-3.5 w-3.5 ml-auto text-gold/60" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/5">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 w-full transition-all"
        >
          <LogOut className="h-5 w-5" />
          <span>Chiqish</span>
        </button>
      </div>
    </aside>
  );
}
