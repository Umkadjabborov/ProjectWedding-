"use client";

import { Building2, CalendarCheck, Users, TrendingUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const iconMap: Record<string, LucideIcon> = {
  Building2,
  CalendarCheck,
  Users,
  TrendingUp,
};

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  description?: string;
  trend?: number;
  color?: "gold" | "blue" | "green" | "rose";
  className?: string;
  index?: number;
}

const colorMap = {
  gold: {
    bg: "bg-gradient-to-br from-gold/15 to-gold/5",
    icon: "bg-gradient-to-br from-gold to-gold-dark text-white shadow-gold",
    text: "text-gold",
    border: "border-gold/20",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-500/10 to-blue-500/5",
    icon: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/20",
  },
  green: {
    bg: "bg-gradient-to-br from-emerald-500/10 to-emerald-500/5",
    icon: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/20",
  },
  rose: {
    bg: "bg-gradient-to-br from-rose-500/10 to-rose-500/5",
    icon: "bg-gradient-to-br from-rose-400 to-rose-500 text-white",
    text: "text-rose-500 dark:text-rose-400",
    border: "border-rose-500/20",
  },
};

export function StatsCard({ title, value, icon, description, trend, color = "gold", className, index = 0 }: StatsCardProps) {
  const c = colorMap[color];
  const Icon = iconMap[icon] ?? Building2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={cn(
        "relative rounded-2xl border p-6 overflow-hidden",
        "bg-card shadow-luxury hover:shadow-luxury-hover transition-all duration-300",
        c.border,
        className
      )}
    >
      {/* Background accent */}
      <div className={cn("absolute inset-0 opacity-40", c.bg)} />

      <div className="relative flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn("text-3xl font-bold font-playfair tracking-tight", c.text)}>
            {value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend !== undefined && (
            <p className={cn("text-xs font-semibold", trend >= 0 ? "text-emerald-600" : "text-red-500")}>
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% bu oy
            </p>
          )}
        </div>

        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", c.icon)}>
          <Icon className="h-5.5 w-5.5" />
        </div>
      </div>
    </motion.div>
  );
}
