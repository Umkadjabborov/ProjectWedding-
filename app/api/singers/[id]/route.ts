import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err, unauthorized, forbidden, notFound, serverError } from "@/lib/api-response";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const singer = await prisma.singer.findUnique({
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

    if (!singer) return notFound("Xonanda");

    return ok(singer);
  } catch (e) {
    console.error("[GET_SINGER]", e);
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

    const singer = await prisma.singer.findUnique({
      where: { id },
      include: { hall: { select: { ownerId: true } } },
    });

    if (!singer) return notFound("Xonanda");

    const isAdmin = session.user.role === "ADMIN";
    const isOwner = session.user.role === "OWNER" && singer.hall.ownerId === session.user.id;

    if (!isAdmin && !isOwner) return forbidden();

    const body = await req.json();
    const { name, price, image } = body;

    if (!name || !price) {
      return err("Xonanda nomi va narxi talab qilinadi", 400);
    }

    const updated = await prisma.singer.update({
      where: { id },
      data: {
        name,
        price: parseFloat(price),
        image: image || singer.image,
      },
      include: {
        hall: { select: { id: true, name: true } },
      },
    });

    return ok(updated);
  } catch (e) {
    console.error("[UPDATE_SINGER]", e);
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

    const singer = await prisma.singer.findUnique({
      where: { id },
      include: { hall: { select: { ownerId: true } } },
    });

    if (!singer) return notFound("Xonanda");

    const isAdmin = session.user.role === "ADMIN";
    const isOwner = session.user.role === "OWNER" && singer.hall.ownerId === session.user.id;

    if (!isAdmin && !isOwner) return forbidden();

    await prisma.singer.delete({ where: { id } });

    return ok({ deleted: true });
  } catch (e) {
    console.error("[DELETE_SINGER]", e);
    return serverError();
  }
}
