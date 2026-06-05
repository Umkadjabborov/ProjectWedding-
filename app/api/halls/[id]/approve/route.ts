import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, unauthorized, notFound, serverError } from "@/lib/api-response";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") return unauthorized();

    const hall = await prisma.hall.findUnique({ where: { id } });
    if (!hall) return notFound("Zal");

    const updated = await prisma.hall.update({
      where: { id },
      data: { status: "APPROVED" },
    });

    return ok(updated);
  } catch (e) {
    console.error("[APPROVE_HALL]", e);
    return serverError();
  }
}
