import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err, unauthorized, forbidden, notFound, serverError } from "@/lib/api-response";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        hall: {
          select: {
            id: true,
            name: true,
            district: true,
            ownerId: true,
          },
        },
      },
    });

    if (!car) return notFound("Mashina");

    return ok(car);
  } catch (e) {
    console.error("[GET_CAR]", e);
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

    const car = await prisma.car.findUnique({
      where: { id },
      include: { hall: { select: { ownerId: true } } },
    });

    if (!car) return notFound("Mashina");

    const isAdmin = session.user.role === "ADMIN";
    const isOwner = session.user.role === "OWNER" && car.hall.ownerId === session.user.id;

    if (!isAdmin && !isOwner) return forbidden();

    const body = await req.json();
    const { brand, price, image } = body;

    if (!brand || !price) {
      return err("Mashina markasi va narxi talab qilinadi", 400);
    }

    const updated = await prisma.car.update({
      where: { id },
      data: {
        brand,
        price: parseFloat(price),
        image: image || car.image,
      },
      include: {
        hall: { select: { id: true, name: true } },
      },
    });

    return ok(updated);
  } catch (e) {
    console.error("[UPDATE_CAR]", e);
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

    const car = await prisma.car.findUnique({
      where: { id },
      include: { hall: { select: { ownerId: true } } },
    });

    if (!car) return notFound("Mashina");

    const isAdmin = session.user.role === "ADMIN";
    const isOwner = session.user.role === "OWNER" && car.hall.ownerId === session.user.id;

    if (!isAdmin && !isOwner) return forbidden();

    await prisma.car.delete({ where: { id } });

    return ok({ deleted: true });
  } catch (e) {
    console.error("[DELETE_CAR]", e);
    return serverError();
  }
}
