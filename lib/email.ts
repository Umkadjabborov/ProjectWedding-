// =============================================================
// FAYL: lib/email.ts
// MAQSAD: Nodemailer orqali email yuborish.
//         Hozirda faqat OTP kodi yuborish uchun ishlatiladi.
//         SMTP sozlamalari .env.local dan olinadi.
//         sendOTPEmail() — foydalanuvchiga 6 xonali kod yuboradi
// =============================================================

import { createTransport } from "nodemailer";

// SMTP transport yaratish — Gmail yoki boshqa SMTP server
const transporter = createTransport({
  host: process.env.EMAIL_HOST,           // smtp.gmail.com
  port: Number(process.env.EMAIL_PORT ?? 587), // 587 (TLS)
  secure: false,                           // false = STARTTLS
  auth: {
    user: process.env.EMAIL_USER,          // Gmail manzil
    pass: process.env.EMAIL_PASS,          // App password
  },
});

// OTP kodi yuborish funksiyasi
// email — qabul qiluvchi manzil
// otp   — 6 xonali tasodifiy kod
// name  — foydalanuvchi ismi (xatda ko'rsatish uchun)
export async function sendOTPEmail(email: string, otp: string, name: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "To'yxona - Email tasdiqlash kodi",
    // HTML formatdagi xat — oltin rang bilan bezatilgan
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #C9A84C;">Assalomu alaykum, ${name}!</h2>
        <p>Hisobingizni tasdiqlash uchun quyidagi kodni kiriting:</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #C9A84C; font-size: 48px; letter-spacing: 8px; margin: 0;">${otp}</h1>
        </div>
        <p style="color: #666;">Bu kod 5 daqiqa davomida amal qiladi.</p>
        <p style="color: #999; font-size: 12px;">Agar siz bu so'rovni yubormagan bo'lsangiz, ushbu xatni e'tiborsiz qoldiring.</p>
      </div>
    `,
  });
}
