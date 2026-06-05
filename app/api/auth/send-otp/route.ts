import { prisma } from "@/lib/prisma";
import { sendOTPEmail } from "@/lib/email";
import { generateOTP } from "@/lib/utils";
import { ok, notFound, serverError } from "@/lib/api-response";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = z.object({ email: z.string().email() }).parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return notFound("Foydalanuvchi");

    await prisma.oTP.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.oTP.create({
      data: { userId: user.id, code, expiresAt },
    });

    await sendOTPEmail(email, code, user.firstName);

    return ok({ message: "OTP yuborildi" });
  } catch (e) {
    console.error("[SEND_OTP]", e);
    return serverError();
  }
}
