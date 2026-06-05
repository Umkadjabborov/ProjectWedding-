import { prisma } from "@/lib/prisma";
import { ok, serverError } from "@/lib/api-response";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookings = await prisma.booking.findMany({
      where: { hallId: id, status: { not: "CANCELLED" } },
      select: { bookingDate: true },
    });

    const dates = bookings.map((b) =>
      new Date(b.bookingDate).toISOString().split("T")[0]
    );

    return ok(dates);
  } catch (e) {
    console.error("[BOOKED_DATES]", e);
    return serverError();
  }
}
