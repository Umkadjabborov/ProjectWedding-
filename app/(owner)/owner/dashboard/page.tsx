import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/shared/stats-card";
import { formatPrice } from "@/lib/utils";
import { completePastBookings } from "@/lib/booking-service";

export default async function OwnerDashboard() {
  const session = await auth();
  const ownerId = session!.user.id;

  await completePastBookings();

  const [halls, bookings, revenue] = await Promise.all([
    prisma.hall.count({ where: { ownerId } }),
    prisma.booking.count({ where: { hall: { ownerId } } }),
    prisma.booking.aggregate({
      _sum: { advancePayment: true },
      where: { hall: { ownerId }, status: { not: "CANCELLED" } },
    }),
  ]);

  const upcoming = await prisma.booking.count({
    where: { hall: { ownerId }, status: "UPCOMING" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-playfair">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Zallarim" value={halls} icon="Building2" />
        <StatsCard title="Jami bronlar" value={bookings} icon="CalendarCheck" />
        <StatsCard title="Kutilayotgan" value={upcoming} icon="Users" />
        <StatsCard title="Daromad" value={formatPrice(revenue._sum.advancePayment ?? 0)} icon="TrendingUp" />
      </div>
    </div>
  );
}
