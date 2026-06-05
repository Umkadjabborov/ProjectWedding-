import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err, unauthorized, serverError } from "@/lib/api-response";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const hallId = searchParams.get("hallId") || "";
    const type = searchParams.get("type") || "";

    const where: Record<string, any> = {};
    if (hallId) where.hallId = hallId;
    if (type) where.type = type;

    const services = await prisma.additionalService.findMany({
      where,
      include: { hall: { select: { id: true, name: true } } },
      orderBy: { name: "asc" },
    });

    return ok(services);
  } catch (e) {
    console.error("[GET_SERVICES]", e);
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
    const { hallId, name, price, type } = body;

    if (!hallId || !name || !price || !type) {
      return err("Zal ID, xizmat nomi, narxi va turi talab qilinadi", 400);
    }

    // Check if hall exists
    const hall = await prisma.hall.findUnique({ where: { id: hallId } });
    if (!hall) {
      return err("Zal topilmadi", 404);
    }

    // Check if user is owner of the hall or admin
    if (session.user.role === "OWNER" && hall.ownerId !== session.user.id) {
      return err("Sizga bu zal uchun xizmat qo'shish huquqi yo'q", 403);
    }

    const service = await prisma.additionalService.create({
      data: {
        hallId,
        name,
        price: parseFloat(price),
        type,
      },
      include: {
        hall: { select: { id: true, name: true } },
      },
    });

    return ok(service, 201);
  } catch (e) {
    console.error("[CREATE_SERVICE]", e);
    return serverError();
  }
}
