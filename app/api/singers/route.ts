import { prisma } from "@/lib/prisma";
import { ok, serverError } from "@/lib/api-response";

export async function GET() {
  try {
    const singers = await prisma.singer.findMany({
      include: { hall: { select: { id: true, name: true } } },
      orderBy: { name: "asc" },
    });
    return ok(singers);
  } catch (e) {
    console.error("[GET_SINGERS]", e);
    return serverError();
  }
}
