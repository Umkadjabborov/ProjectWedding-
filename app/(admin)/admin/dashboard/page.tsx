import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/shared/stats-card";
import { formatPrice } from "@/lib/utils";
import { completePastBookings } from "@/lib/booking-service";

export const metadata: Metadata = { title: "Dashboard - Admin" };

export default async function AdminDashboard() {
  await completePastBookings();

  const [totalHalls, pendingHalls, totalBookings, owners, revenue] = await Promise.all([
    prisma.hall.count(),
    prisma.hall.count({ where: { status: "PENDING" } }),
    prisma.booking.count(),
    prisma.user.count({ where: { role: "OWNER" } }),
    prisma.booking.aggregate({
      _sum: { advancePayment: true },
      where: { status: { not: "CANCELLED" } },
    }),
  ]);

  const stats = [
    {
      title: "Jami zallar",
      value: totalHalls,
      icon: "Building2",
      description: `${pendingHalls} ta tasdiqlash kutmoqda`,
      color: "gold" as const,
      index: 0,
    },
    {
      title: "Jami bronlar",
      value: totalBookings,
      icon: "CalendarCheck",
      color: "blue" as const,
      index: 1,
    },
    {
      title: "Egalar",
      value: owners,
      icon: "Users",
      color: "rose" as const,
      index: 2,
    },
    {
      title: "Jami daromad",
      value: formatPrice(revenue._sum.advancePayment ?? 0),
      icon: "TrendingUp",
      color: "green" as const,
      index: 3,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-playfair text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platformaning umumiy ko&apos;rinishi</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>
    </div>
  );
}
