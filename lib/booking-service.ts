import { prisma } from "@/lib/prisma";

export async function completePastBookings(): Promise<void> {
  try {
    await prisma.booking.updateMany({
      where: {
        bookingDate: { lt: new Date() },
        status: "UPCOMING",
      },
      data: { status: "COMPLETED" },
    });
  } catch (e) {
    console.error("[completePastBookings]", e);
  }
}
