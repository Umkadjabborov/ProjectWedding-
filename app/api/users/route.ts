import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err, unauthorized, forbidden, serverError } from "@/lib/api-response";
import bcrypt from "bcrypt";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return forbidden();
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || "";
    const search = searchParams.get("search") || "";

    const where: Record<string, any> = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        phone: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return ok(users);
  } catch (e) {
    console.error("[GET_USERS]", e);
    return serverError();
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return forbidden();
    }

    const body = await req.json();
    const { firstName, lastName, email, username, password, phone, role } = body;

    if (!firstName || !lastName || !email || !username || !password) {
      return err("Ism, familiya, email, username va parol talab qilinadi", 400);
    }

    // Check if email or username already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existing) {
      return err("Bu email yoki username allaqachon mavjud", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        phone: phone || null,
        role: role || "USER",
        isVerified: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        phone: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    return ok(user, 201);
  } catch (e) {
    console.error("[CREATE_USER]", e);
    return serverError();
  }
}
