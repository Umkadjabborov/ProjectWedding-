import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err, unauthorized, serverError } from "@/lib/api-response";
import { bookingSchema } from "@/lib/validations";
import { normalizeBooking } from "@/lib/prisma-transform";

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
        hall: { select: { id: true, name: true, district: true, hallImages: { select: { url: true } } } },
        user: { select: { id: true, firstName: true, lastName: true, phone: true, email: true } },
        bookingServices: true,
      },
      orderBy: { bookingDate: sortOrder },
    });

    return ok(bookings.map(normalizeBooking));
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
      where: { hallId, bookingDate, status: { not: "CANCELLED" } },
    });
    if (existing) return err("Bu sana band", 400);

    const servicesTotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
    const totalPrice = BigInt(guestCount * Number(hall.pricePerSeat) + servicesTotal);
    const advancePayment = totalPrice / BigInt(5);

    const booking = await prisma.booking.create({
      data: {
        id: randomUUID(),
        hallId,
        userId: session.user.id,
        bookingDate,
        guestCount,
        totalPrice,
        advancePayment,
        status: "UPCOMING",
        bookingServices: selectedServices.length
          ? {
              create: selectedServices.map((service) => ({
                serviceType: service.type as "SINGER" | "CAR" | "KARNAY",
                serviceName: service.name,
                price: BigInt(service.price),
              })),
            }
          : undefined,
      },
      include: {
        hall: { select: { id: true, name: true, district: true, hallImages: { select: { url: true } } } },
        user: { select: { id: true, firstName: true, lastName: true } },
        bookingServices: true,
      },
    });

    return ok(normalizeBooking(booking), 201);
  } catch (e) {
    console.error("[CREATE_BOOKING]", e);
    return serverError();
  }
}
