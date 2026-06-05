import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err, unauthorized, serverError } from "@/lib/api-response";
import { hallSchema } from "@/lib/validations";
import type { HallFilters } from "@/types";
import { normalizeHall } from "@/lib/prisma-transform";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const district = searchParams.get("district") || "";
    const status = searchParams.get("status") as HallFilters["status"] | null;
    const sortBy = (searchParams.get("sortBy") || "createdAt") as string;
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

    const session = await auth();
    const isAdmin = session?.user.role === "ADMIN";
    const isOwner = session?.user.role === "OWNER";

    const where: Record<string, unknown> = {};

    if (search) where.name = { contains: search, mode: "insensitive" };
    if (district) where.district = district;

    if (isAdmin) {
      if (status) where.status = status;
    } else if (isOwner) {
      where.ownerId = session!.user.id;
    } else {
      where.status = "APPROVED";
    }

    const halls = await prisma.hall.findMany({
      where,
      include: {
        owner: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        hallImages: true,
      },
      orderBy: { [sortBy]: sortOrder },
    });

    return ok(halls.map(normalizeHall));
  } catch (e) {
    console.error("[GET_HALLS]", e);
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
    const { singers, cars, menuItems, karnayPrice, images, ...hallData } = body;
    const validated = hallSchema.parse(hallData);

    const hall = await prisma.hall.create({
      data: {
        id: randomUUID(),
        ...validated,
        ownerId: session.user.role === "OWNER" ? session.user.id : (body.ownerId || session.user.id),
        status: session.user.role === "OWNER" ? "PENDING" : "APPROVED",
        karnayEnabled: Boolean(karnayPrice),
        karnayPrice: karnayPrice ?? undefined,
        hallImages: images?.length
          ? {
              create: images.map((url: string, index: number) => ({
                url,
                sortOrder: index,
              })),
            }
          : undefined,
        singers: singers?.length ? { create: singers } : undefined,
        cars: cars?.length ? { create: cars } : undefined,
        menuItems: menuItems?.length ? { create: menuItems } : undefined,
      },
      include: { singers: true, cars: true, menuItems: true, hallImages: true },
    });

    return ok(normalizeHall(hall), 201);
  } catch (e) {
    console.error("[CREATE_HALL]", e);
    return serverError();
  }
}
