import { prisma } from "@/lib/prisma";
import { ok, serverError } from "@/lib/api-response";
import { normalizePrismaValue } from "@/lib/prisma-transform";

export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      include: { hall: { select: { id: true, name: true } } },
      orderBy: { brand: "asc" },
    });
    return ok(normalizePrismaValue(cars));
  } catch (e) {
    console.error("[GET_CARS]", e);
    return serverError();
  }
}
