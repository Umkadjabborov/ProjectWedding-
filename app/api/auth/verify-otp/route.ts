import { prisma } from "@/lib/prisma";
import { ok, err, notFound, serverError } from "@/lib/api-response";
import { otpSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code } = otpSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return notFound("Foydalanuvchi");

    const otp = await prisma.otpCode.findFirst({
      where: {
        userId: user.id,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otp) return err("Noto'g'ri yoki muddati o'tgan kod", 400);

    await prisma.otpCode.update({ where: { id: otp.id }, data: { used: true } });
    await prisma.user.update({ where: { id: user.id }, data: { isVerified: true } });

    return ok({ verified: true });
  } catch (e) {
    console.error("[VERIFY_OTP]", e);
    return serverError();
  }
}
