import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, unauthorized, serverError } from "@/lib/api-response";
import { completePastBookings } from "@/lib/booking-service";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") return unauthorized();

    await completePastBookings();

    const [
      totalHalls,
      pendingHalls,
      approvedHalls,
      totalBookings,
      upcomingBookings,
      completedBookings,
      cancelledBookings,
      totalOwners,
      totalUsers,
      revenue,
    ] = await Promise.all([
      prisma.hall.count(),
      prisma.hall.count({ where: { status: "PENDING" } }),
      prisma.hall.count({ where: { status: "APPROVED" } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "UPCOMING" } }),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.booking.count({ where: { status: "CANCELLED" } }),
      prisma.user.count({ where: { role: "OWNER" } }),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.booking.aggregate({
        _sum: { advancePayment: true },
        where: { status: { not: "CANCELLED" } },
      }),
    ]);

    return ok({
      totalHalls,
      pendingHalls,
      approvedHalls,
      totalBookings,
      upcomingBookings,
      completedBookings,
      cancelledBookings,
      totalOwners,
      totalUsers,
      totalRevenue: revenue._sum.advancePayment ?? 0,
    });
  } catch (e) {
    console.error("[DASHBOARD_STATS]", e);
    return serverError();
  }
}
