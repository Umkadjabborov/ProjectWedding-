import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err, unauthorized, serverError } from "@/lib/api-response";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const hallId = searchParams.get("hallId") || "";

    const where = hallId ? { hallId } : {};

    const menuItems = await prisma.menuItem.findMany({
      where,
      include: { hall: { select: { id: true, name: true } } },
      orderBy: { name: "asc" },
    });

    return ok(menuItems);
  } catch (e) {
    console.error("[GET_MENU_ITEMS]", e);
    return serverError();
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
      return unauthorized();
    }

    const body = await req.json();
    const { hallId, name, image } = body;

    if (!hallId || !name) {
      return err("Zal ID va taom nomi talab qilinadi", 400);
    }

    // Check if hall exists
    const hall = await prisma.hall.findUnique({ where: { id: hallId } });
    if (!hall) {
      return err("Zal topilmadi", 404);
    }

    // Check if user is owner of the hall or admin
    if (session.user.role === "OWNER" && hall.ownerId !== session.user.id) {
      return err("Sizga bu zal uchun menyu qo'shish huquqi yo'q", 403);
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        hallId,
        name,
        image: image || "",
      },
      include: {
        hall: { select: { id: true, name: true } },
      },
    });

    return ok(menuItem, 201);
  } catch (e) {
    console.error("[CREATE_MENU_ITEM]", e);
    return serverError();
  }
}
