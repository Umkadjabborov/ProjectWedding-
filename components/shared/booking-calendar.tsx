"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookedDate {
  date: Date;
  guestCount?: number;
  user?: { firstName: string; lastName: string; phone?: string | null };
}

interface BookingCalendarProps {
  bookedDates: BookedDate[];
  onDateClick?: (date: Date) => void;
  disablePast?: boolean;
  className?: string;
}

const DAYS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
const MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

export function BookingCalendar({ bookedDates, onDateClick, disablePast = true, className }: BookingCalendarProps) {
  const [current, setCurrent] = useState(new Date());
  const [tooltip, setTooltip] = useState<{ date: Date; info: BookedDate } | null>(null);

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const getStatus = (day: number) => {
    const date = new Date(year, month, day);
    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const booked = bookedDates.find((b) => isSameDay(new Date(b.date), date));
    return { isPast, booked };
  };

  return (
    <div className={cn("rounded-xl border bg-card p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={() => setCurrent(new Date(year, month - 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold">{MONTHS[month]} {year}</h3>
        <Button variant="ghost" size="icon" onClick={() => setCurrent(new Date(year, month + 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: offset }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const { isPast, booked } = getStatus(day);
          const date = new Date(year, month, day);

          return (
            <button
              key={day}
              type="button"
              disabled={isPast && disablePast || !!booked}
              onClick={() => !isPast && !booked && onDateClick?.(date)}
              onMouseEnter={() => booked && setTooltip({ date, info: booked })}
              onMouseLeave={() => setTooltip(null)}
              className={cn(
                "relative aspect-square rounded-lg text-sm font-medium transition-colors flex items-center justify-center",
                isPast && "text-muted-foreground/40 bg-muted/30 cursor-not-allowed",
                booked && !isPast && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 cursor-pointer",
                !isPast && !booked && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200 cursor-pointer",
                isSameDay(date, today) && "ring-2 ring-primary"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {tooltip && (
        <div className="mt-3 p-3 rounded-lg bg-muted text-sm">
          <p className="font-medium">Band: {tooltip.info.user?.firstName} {tooltip.info.user?.lastName}</p>
          {tooltip.info.user?.phone && <p className="text-muted-foreground">{tooltip.info.user.phone}</p>}
          {tooltip.info.guestCount && <p className="text-muted-foreground">Mehmonlar: {tooltip.info.guestCount}</p>}
        </div>
      )}

      <div className="flex gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-200" /> Bo'sh</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-200" /> Band</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-muted" /> O'tgan</div>
      </div>
    </div>
  );
}
