import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, unauthorized, notFound, serverError } from "@/lib/api-response";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") return unauthorized();

    const body = await req.json();
    const { hallId, ownerId } = z.object({
      hallId: z.string(),
      ownerId: z.string(),
    }).parse(body);

    const [hall, owner] = await Promise.all([
      prisma.hall.findUnique({ where: { id: hallId } }),
      prisma.user.findUnique({ where: { id: ownerId, role: "OWNER" } }),
    ]);

    if (!hall) return notFound("Zal");
    if (!owner) return notFound("Egasi");

    const updated = await prisma.hall.update({
      where: { id: hallId },
      data: { ownerId },
    });

    return ok(updated);
  } catch (e) {
    console.error("[ASSIGN_OWNER]", e);
    return serverError();
  }
}
