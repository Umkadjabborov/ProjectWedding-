import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ok, err, unauthorized, forbidden, notFound, serverError } from "@/lib/api-response";
import bcrypt from "bcrypt";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return unauthorized();

    const isAdmin = session.user.role === "ADMIN";
    const isSelf = session.user.id === id;

    if (!isAdmin && !isSelf) return forbidden();

    const user = await prisma.user.findUnique({
      where: { id },
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
    });

    if (!user) return notFound("Foydalanuvchi");

    return ok(user);
  } catch (e) {
    console.error("[GET_USER]", e);
    return serverError();
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return unauthorized();

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return notFound("Foydalanuvchi");

    const isAdmin = session.user.role === "ADMIN";
    const isSelf = session.user.id === id;

    if (!isAdmin && !isSelf) return forbidden();

    const body = await req.json();
    const { firstName, lastName, phone, password, role } = body;

    const updateData: Record<string, any> = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Only admin can update role
    if (isAdmin && role) {
      updateData.role = role;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
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
    });

    return ok(updated);
  } catch (e) {
    console.error("[UPDATE_USER]", e);
    return serverError();
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return unauthorized();

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return notFound("Foydalanuvchi");

    if (session.user.role !== "ADMIN") {
      return forbidden();
    }

    await prisma.user.delete({ where: { id } });

    return ok({ deleted: true });
  } catch (e) {
    console.error("[DELETE_USER]", e);
    return serverError();
  }
}
