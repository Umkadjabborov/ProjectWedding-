import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err, unauthorized, serverError } from "@/lib/api-response";
import { bookingSchema } from "@/lib/validations";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) return unauthorized();

    const { searchParams } = new URL(req.url);
    const hallId = searchParams.get("hallId") || "";
    const district = searchParams.get("district") || "";
    const status = searchParams.get("status") || "";
    const sortOrder = (searchParams.get("sortOrder") || "asc") as "asc" | "desc";

    const where: Record<string, unknown> = {};

    if (session.user.role === "USER") {
      where.userId = session.user.id;
    } else if (session.user.role === "OWNER") {
      where.hall = { ownerId: session.user.id };
    }

    if (hallId) where.hallId = hallId;
    if (status) where.status = status;
    if (district) where.hall = { ...(where.hall as object || {}), district };

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        hall: { select: { id: true, name: true, district: true, images: true } },
        user: { select: { id: true, firstName: true, lastName: true, phone: true, email: true } },
      },
      orderBy: { date: sortOrder },
    });

    return ok(bookings);
  } catch (e) {
    console.error("[GET_BOOKINGS]", e);
    return serverError();
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return unauthorized();

    const body = await req.json();
    
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
      return err(errors, 400);
    }
    const { hallId, date, guestCount, selectedServices } = parsed.data;

    const hall = await prisma.hall.findUnique({ where: { id: hallId } });
    if (!hall) return err("Zal topilmadi", 404);
    if (hall.status !== "APPROVED") return err("Zal tasdiqlanmagan", 400);

    if (guestCount > hall.capacity) {
      return err(`Mehmonlar soni ${hall.capacity} dan oshmasligi kerak`, 400);
    }

    const bookingDate = new Date(date);
    const existing = await prisma.booking.findFirst({
      where: { hallId, date: bookingDate, status: { not: "CANCELLED" } },
    });
    if (existing) return err("Bu sana band", 400);

    const servicesTotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
    const totalPrice = guestCount * hall.pricePerSeat + servicesTotal;
    const advancePayment = totalPrice * 0.2;

    const booking = await prisma.booking.create({
      data: {
        hallId,
        userId: session.user.id,
        date: bookingDate,
        guestCount,
        totalPrice,
        advancePayment,
        selectedServices,
        status: "UPCOMING",
      },
      include: {
        hall: { select: { id: true, name: true, district: true } },
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return ok(booking, 201);
  } catch (e) {
    console.error("[CREATE_BOOKING]", e);
    return serverError();
  }
}
