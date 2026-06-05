"use client";

import { cn } from "@/lib/utils";
import type { BookingStatus, HallStatus } from "@/types";

type Status = BookingStatus | HallStatus | string;

const statusConfig: Record<string, { label: string; dot: string; className: string }> = {
  UPCOMING: {
    label: "Kutilmoqda",
    dot: "bg-blue-500",
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/50",
  },
  COMPLETED: {
    label: "Yakunlangan",
    dot: "bg-emerald-500",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50",
  },
  CANCELLED: {
    label: "Bekor qilingan",
    dot: "bg-red-500",
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/50",
  },
  APPROVED: {
    label: "Tasdiqlangan",
    dot: "bg-emerald-500",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50",
  },
  PENDING: {
    label: "Kutilmoqda",
    dot: "bg-amber-500",
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50",
  },
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const config = statusConfig[status] ?? {
    label: status,
    dot: "bg-gray-400",
    className: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border",
      config.className,
      className
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)} />
      {config.label}
    </span>
  );
}
