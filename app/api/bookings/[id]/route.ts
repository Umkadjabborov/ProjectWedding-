import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err, unauthorized, forbidden, notFound, serverError } from "@/lib/api-response";
import { bookingSchema } from "@/lib/validations";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return unauthorized();

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        hall: { select: { id: true, name: true, district: true, images: true, ownerId: true } },
        user: { select: { id: true, firstName: true, lastName: true, phone: true, email: true } },
      },
    });

    if (!booking) return notFound("Bron");

    // Check permissions
    const isAdmin = session.user.role === "ADMIN";
    const isOwner = session.user.role === "OWNER" && booking.hall.ownerId === session.user.id;
    const isUser = booking.userId === session.user.id;

    if (!isAdmin && !isOwner && !isUser) return forbidden();

    return ok(booking);
  } catch (e) {
    console.error("[GET_BOOKING]", e);
    return serverError();
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return unauthorized();

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { hall: { select: { ownerId: true, capacity: true, pricePerSeat: true } } },
    });

    if (!booking) return notFound("Bron");

    // Check permissions - only admin or owner can update
    const isAdmin = session.user.role === "ADMIN";
    const isOwner = session.user.role === "OWNER" && booking.hall.ownerId === session.user.id;

    if (!isAdmin && !isOwner) return forbidden();

    const body = await req.json();
    const { date, guestCount, selectedServices, status } = body;

    // Validate if guestCount doesn't exceed capacity
    if (guestCount && guestCount > booking.hall.capacity) {
      return err(
        `Mehmonlar soni ${booking.hall.capacity} dan oshmasligi kerak`,
        400
      );
    }

    // Check if date is available if date is being changed
    if (date && new Date(date).getTime() !== booking.date.getTime()) {
      const existing = await prisma.booking.findFirst({
        where: {
          hallId: booking.hallId,
          date: new Date(date),
          status: { not: "CANCELLED" },
          id: { not: id },
        },
      });
      if (existing) return err("Bu sana band", 400);
    }

    // Calculate new price if guestCount or selectedServices changed
    let totalPrice = booking.totalPrice;
    let advancePayment = booking.advancePayment;

    if (guestCount || selectedServices) {
      const newGuestCount = guestCount || booking.guestCount;
      const newSelectedServices = selectedServices || booking.selectedServices;
      const servicesTotal =
        typeof newSelectedServices === "string"
          ? JSON.parse(newSelectedServices).reduce((sum: number, s: any) => sum + s.price, 0)
          : Array.isArray(newSelectedServices)
          ? newSelectedServices.reduce((sum: number, s: any) => sum + s.price, 0)
          : 0;

      totalPrice = newGuestCount * booking.hall.pricePerSeat + servicesTotal;
      advancePayment = totalPrice * 0.2;
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        ...(date && { date: new Date(date) }),
        ...(guestCount && { guestCount }),
        ...(selectedServices && { selectedServices }),
        ...(status && { status }),
        totalPrice,
        advancePayment,
      },
      include: {
        hall: { select: { id: true, name: true, district: true } },
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return ok(updated);
  } catch (e) {
    console.error("[UPDATE_BOOKING]", e);
    return serverError();
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return unauthorized();

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { hall: { select: { ownerId: true } } },
    });

    if (!booking) return notFound("Bron");

    const isAdmin = session.user.role === "ADMIN";
    const isOwner = session.user.role === "OWNER" && booking.hall.ownerId === session.user.id;
    const isUser = booking.userId === session.user.id;

    if (!isAdmin && !isOwner && !isUser) return forbidden();

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return ok(updated);
  } catch (e) {
    console.error("[CANCEL_BOOKING]", e);
    return serverError();
  }
}

