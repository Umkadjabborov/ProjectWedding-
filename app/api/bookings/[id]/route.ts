import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, unauthorized, forbidden, notFound, serverError } from "@/lib/api-response";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return unauthorized();

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { hall: { select: { ownerId: true } } },
    });

    if (!booking) return notFound("Bron");

    const isAdmin = session.user.role === "ADMIN";
    const isOwner = session.user.role === "OWNER" && booking.hall.ownerId === session.user.id;
    const isUser = booking.userId === session.user.id;

    if (!isAdmin && !isOwner && !isUser) return forbidden();

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return ok(updated);
  } catch (e) {
    console.error("[CANCEL_BOOKING]", e);
    return serverError();
  }
}
