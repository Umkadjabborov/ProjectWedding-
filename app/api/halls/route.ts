import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err, unauthorized, serverError } from "@/lib/api-response";
import { hallSchema } from "@/lib/validations";
import type { HallFilters } from "@/types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const district = searchParams.get("district") || "";
    const status = searchParams.get("status") as HallFilters["status"] | null;
    const sortBy = (searchParams.get("sortBy") || "createdAt") as string;
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

    const session = await auth();
    // session?.user?.role orqali xavfsiz tekshiramiz, session bo'lmasa undefined qaytadi
    const isAdmin = session?.user?.role === "ADMIN";
    const isOwner = session?.user?.role === "OWNER";
    const userId = session?.user?.id;

    const where: Record<string, unknown> = {};

    if (search) where.name = { contains: search, mode: "insensitive" };
    if (district) where.district = district;

    if (isAdmin) {
      if (status) where.status = status;
    } else if (isOwner && userId) {
      // Ega faqat o'z zallarini ko'radi
      where.ownerId = userId;
    } else {
      // Mehmonlar va oddiy foydalanuvchilar faqat tasdiqlanganlarni ko'radi
      where.status = "APPROVED";
    }

    const halls = await prisma.hall.findMany({
      where,
      include: {
        // Telefon raqami faqat Admin yoki Ega (o'z zali bo'lsa) ko'rishi mumkin
        owner: { select: { id: true, firstName: true, lastName: true, phone: isAdmin } },
        _count: { select: { bookings: true } },
      },
      orderBy: { [sortBy]: sortOrder },
    });

    return ok(halls);
  } catch (e) {
    const errAny = e as any;
    console.error("[GET_HALLS]", errAny, errAny?.stack || "no-stack");
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
    const { singers, cars, menuItems, karnayPrice, ...hallData } = body;
    const validated = hallSchema.parse(hallData);

    const hall = await prisma.hall.create({
      data: {
        ...validated,
        ownerId: session.user.role === "OWNER" ? session.user.id : (body.ownerId || session.user.id),
        status: session.user.role === "OWNER" ? "PENDING" : "APPROVED",
        singers: singers?.length ? { create: singers } : undefined,
        cars: cars?.length ? { create: cars } : undefined,
        menuItems: menuItems?.length ? { create: menuItems } : undefined,
        services: karnayPrice
          ? { create: [{ name: "Karnay-Surnay", price: karnayPrice, type: "KARNAY" }] }
          : undefined,
      },
      include: { singers: true, cars: true, menuItems: true, services: true },
    });

    return ok(hall, 201);
  } catch (e) {
    console.error("[CREATE_HALL]", e);
    return serverError();
  }
}
