"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Building2, CalendarCheck, Users, CheckSquare,
  LogOut, Menu, X, Crown, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/halls", label: "Zallar", icon: Building2 },
  { href: "/admin/bookings", label: "Bronlar", icon: CalendarCheck },
  { href: "/admin/owners", label: "Egalar", icon: Users },
  { href: "/admin/approvals", label: "Tasdiqlash", icon: CheckSquare },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed left-0 top-0 z-30 h-full flex flex-col transition-all duration-300 ease-in-out",
        "bg-navy border-r border-white/5",
        sidebarOpen ? "w-64" : "w-0 lg:w-[72px] lg:overflow-visible overflow-hidden"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-gold shrink-0">
            <Crown className="h-4.5 w-4.5 text-white" />
          </div>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-playfair font-bold text-lg text-white whitespace-nowrap"
            >
              To&apos;yxona
            </motion.span>
          )}
          <button
            onClick={toggleSidebar}
            className="ml-auto lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                  active
                    ? "bg-gradient-to-r from-gold/20 to-gold/5 text-gold border border-gold/20"
                    : "text-white/50 hover:text-white hover:bg-white/8"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0 transition-colors", active ? "text-gold" : "text-white/40 group-hover:text-white")} />
                {sidebarOpen && (
                  <span className="whitespace-nowrap">{label}</span>
                )}
                {active && sidebarOpen && (
                  <ChevronRight className="h-3.5 w-3.5 ml-auto text-gold/60" />
                )}
                {/* Tooltip for collapsed */}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-navy border border-white/10 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50">
                    {label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/5 shrink-0">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 w-full transition-all group"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Chiqish</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export function AdminTopbar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const pathname = usePathname();

  const pageTitle: Record<string, string> = {
    "/admin/dashboard": "Dashboard",
    "/admin/halls": "Zallar",
    "/admin/bookings": "Bronlar",
    "/admin/owners": "Egalar",
    "/admin/approvals": "Tasdiqlash",
  };

  const title = Object.entries(pageTitle).find(([key]) => pathname.startsWith(key))?.[1] ?? "Admin";

  return (
    <header className={cn(
      "h-16 border-b border-border/60 bg-card/80 backdrop-blur-sm flex items-center px-6 gap-4 sticky top-0 z-10 transition-all duration-300",
      sidebarOpen ? "lg:pl-64" : "lg:pl-[72px]"
    )}>
      <button
        onClick={toggleSidebar}
        className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="h-5 w-px bg-border" />
      <h1 className="font-playfair font-semibold text-lg">{title}</h1>
    </header>
  );
}
