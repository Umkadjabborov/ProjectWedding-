import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, unauthorized, err, serverError } from "@/lib/api-response";
import { ownerSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function GET(_req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") return unauthorized();

    const owners = await prisma.user.findMany({
      where: { role: "OWNER" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        phone: true,
        isVerified: true,
        createdAt: true,
        halls: { select: { id: true, name: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return ok(owners);
  } catch (e) {
    console.error("[GET_OWNERS]", e);
    return serverError();
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") return unauthorized();

    const body = await req.json();
    const validated = ownerSchema.parse(body);

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: validated.email }, { username: validated.username }] },
    });
    if (existing) return err("Email yoki username band", 400);

    const hashed = await bcrypt.hash(validated.password, 10);
    const owner = await prisma.user.create({
      data: {
        id: randomUUID(),
        ...validated,
        password: hashed,
        role: "OWNER",
        isVerified: true,
        phone: validated.phone ?? "",
      },
      select: {
        id: true, firstName: true, lastName: true,
        email: true, username: true, phone: true, role: true, createdAt: true,
      },
    });

    return ok(owner, 201);
  } catch (e) {
    console.error("[CREATE_OWNER]", e);
    return serverError();
  }
}
