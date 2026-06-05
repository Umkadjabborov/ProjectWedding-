import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err, unauthorized, forbidden, notFound, serverError } from "@/lib/api-response";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const service = await prisma.additionalService.findUnique({
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

    if (!service) return notFound("Xizmat");

    return ok(service);
  } catch (e) {
    console.error("[GET_SERVICE]", e);
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

    const service = await prisma.additionalService.findUnique({
      where: { id },
      include: { hall: { select: { ownerId: true } } },
    });

    if (!service) return notFound("Xizmat");

    const isAdmin = session.user.role === "ADMIN";
    const isOwner = session.user.role === "OWNER" && service.hall.ownerId === session.user.id;

    if (!isAdmin && !isOwner) return forbidden();

    const body = await req.json();
    const { name, price, type } = body;

    if (!name || !price) {
      return err("Xizmat nomi va narxi talab qilinadi", 400);
    }

    const updated = await prisma.additionalService.update({
      where: { id },
      data: {
        name,
        price: parseFloat(price),
        type: type || service.type,
      },
      include: {
        hall: { select: { id: true, name: true } },
      },
    });

    return ok(updated);
  } catch (e) {
    console.error("[UPDATE_SERVICE]", e);
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

    const service = await prisma.additionalService.findUnique({
      where: { id },
      include: { hall: { select: { ownerId: true } } },
    });

    if (!service) return notFound("Xizmat");

    const isAdmin = session.user.role === "ADMIN";
    const isOwner = session.user.role === "OWNER" && service.hall.ownerId === session.user.id;

    if (!isAdmin && !isOwner) return forbidden();

    await prisma.additionalService.delete({ where: { id } });

    return ok({ deleted: true });
  } catch (e) {
    console.error("[DELETE_SERVICE]", e);
    return serverError();
  }
}
