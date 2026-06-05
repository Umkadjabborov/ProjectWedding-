import { prisma } from "@/lib/prisma";
import { ok, serverError } from "@/lib/api-response";

export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      include: { hall: { select: { id: true, name: true } } },
      orderBy: { brand: "asc" },
    });
    return ok(cars);
  } catch (e) {
    console.error("[GET_CARS]", e);
    return serverError();
  }
}
