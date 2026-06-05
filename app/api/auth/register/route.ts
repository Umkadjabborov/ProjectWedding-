import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { ok, err, serverError } from "@/lib/api-response";
import { registerSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: validated.email }, { username: validated.username }] },
    });
    if (existing) return err("Email yoki username band", 400);

    const hashed = await bcrypt.hash(validated.password, 10);
    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        ...validated,
        password: hashed,
        role: "USER",
        isVerified: true,
        phone: validated.phone ?? "",
      },
      select: { id: true, firstName: true, lastName: true, email: true, role: true },
    });

    return ok(user, 201);
  } catch (e) {
    console.error("[REGISTER]", e);
    return serverError();
  }
}
