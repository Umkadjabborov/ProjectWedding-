import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err, unauthorized, forbidden, notFound, serverError } from "@/lib/api-response";
import { hallSchema } from "@/lib/validations";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const isAdmin = session?.user.role === "ADMIN";
    const isOwner = session?.user.role === "OWNER";

    const hall = await prisma.hall.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        services: true,
        singers: true,
        cars: true,
        menuItems: true,
        bookings: {
          where: { status: { not: "CANCELLED" } },
          select: {
            date: true,
            guestCount: true,
            user: { select: { firstName: true, lastName: true, phone: true } },
          },
        },
      },
    });

    if (!hall) return notFound("Zal");
    
    if (hall.status !== "APPROVED" && !isAdmin && !isOwner) return notFound("Zal");
    
    return ok(hall);
  } catch (e) {
    console.error("[GET_HALL]", e);
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
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
      return unauthorized();
    }

    const hall = await prisma.hall.findUnique({ where: { id } });
    if (!hall) return notFound("Zal");

    if (session.user.role === "OWNER" && hall.ownerId !== session.user.id) {
      return forbidden();
    }

    const body = await req.json();
    const { singers, cars, menuItems, karnayPrice, ...hallData } = body;
    const validated = hallSchema.parse(hallData);

    await prisma.$transaction([
      prisma.singer.deleteMany({ where: { hallId: id } }),
      prisma.car.deleteMany({ where: { hallId: id } }),
      prisma.menuItem.deleteMany({ where: { hallId: id } }),
      prisma.additionalService.deleteMany({ where: { hallId: id, type: "KARNAY" } }),
    ]);

    const updated = await prisma.hall.update({
      where: { id },
      data: {
        ...validated,
        singers: singers?.length ? { create: singers } : undefined,
        cars: cars?.length ? { create: cars } : undefined,
        menuItems: menuItems?.length ? { create: menuItems } : undefined,
        services: karnayPrice
          ? { create: [{ name: "Karnay-Surnay", price: karnayPrice, type: "KARNAY" }] }
          : undefined,
      },
      include: { singers: true, cars: true, menuItems: true, services: true },
    });

    return ok(updated);
  } catch (e) {
    console.error("[UPDATE_HALL]", e);
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
    if (!session || session.user.role !== "ADMIN") return unauthorized();

    await prisma.hall.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (e) {
    console.error("[DELETE_HALL]", e);
    return serverError();
  }
}
