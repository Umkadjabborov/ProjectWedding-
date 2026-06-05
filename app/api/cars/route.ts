import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err, unauthorized, serverError } from "@/lib/api-response";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const hallId = searchParams.get("hallId") || "";

    const where = hallId ? { hallId } : {};

    const cars = await prisma.car.findMany({
      where,
      include: { hall: { select: { id: true, name: true } } },
      orderBy: { brand: "asc" },
    });
    return ok(cars);
  } catch (e) {
    console.error("[GET_CARS]", e);
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
    const { hallId, brand, price, image } = body;

    if (!hallId || !brand || !price) {
      return err("Zal ID, mashina markasi va narxi talab qilinadi", 400);
    }

    // Check if hall exists
    const hall = await prisma.hall.findUnique({ where: { id: hallId } });
    if (!hall) {
      return err("Zal topilmadi", 404);
    }

    // Check if user is owner of the hall or admin
    if (session.user.role === "OWNER" && hall.ownerId !== session.user.id) {
      return err("Sizga bu zal uchun mashina qo'shish huquqi yo'q", 403);
    }

    const car = await prisma.car.create({
      data: {
        hallId,
        brand,
        price: parseFloat(price),
        image: image || "",
      },
      include: {
        hall: { select: { id: true, name: true } },
      },
    });

    return ok(car, 201);
  } catch (e) {
    console.error("[CREATE_CAR]", e);
    return serverError();
  }
}
