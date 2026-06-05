import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err, unauthorized, forbidden, notFound, serverError } from "@/lib/api-response";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const menuItem = await prisma.menuItem.findUnique({
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

    if (!menuItem) return notFound("Menyu elementi");

    return ok(menuItem);
  } catch (e) {
    console.error("[GET_MENU_ITEM]", e);
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

    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: { hall: { select: { ownerId: true } } },
    });

    if (!menuItem) return notFound("Menyu elementi");

    const isAdmin = session.user.role === "ADMIN";
    const isOwner = session.user.role === "OWNER" && menuItem.hall.ownerId === session.user.id;

    if (!isAdmin && !isOwner) return forbidden();

    const body = await req.json();
    const { name, image } = body;

    if (!name) {
      return err("Taom nomi talab qilinadi", 400);
    }

    const updated = await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        image: image || menuItem.image,
      },
      include: {
        hall: { select: { id: true, name: true } },
      },
    });

    return ok(updated);
  } catch (e) {
    console.error("[UPDATE_MENU_ITEM]", e);
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

    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: { hall: { select: { ownerId: true } } },
    });

    if (!menuItem) return notFound("Menyu elementi");

    const isAdmin = session.user.role === "ADMIN";
    const isOwner = session.user.role === "OWNER" && menuItem.hall.ownerId === session.user.id;

    if (!isAdmin && !isOwner) return forbidden();

    await prisma.menuItem.delete({ where: { id } });

    return ok({ deleted: true });
  } catch (e) {
    console.error("[DELETE_MENU_ITEM]", e);
    return serverError();
  }
}
