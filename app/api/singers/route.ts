import { prisma } from "@/lib/prisma";
import { ok, serverError } from "@/lib/api-response";
import { normalizePrismaValue } from "@/lib/prisma-transform";

export async function GET() {
  try {
    const singers = await prisma.singer.findMany({
      include: { hall: { select: { id: true, name: true } } },
      orderBy: { name: "asc" },
    });
    return ok(normalizePrismaValue(singers));
  } catch (e) {
    console.error("[GET_SINGERS]", e);
    return serverError();
  }
}
