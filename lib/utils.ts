// =============================================================
// FAYL: lib/utils.ts
// MAQSAD: Umumiy yordamchi funksiyalar va konstantalar.
//         cn()           — Tailwind class birlashtirish
//         TASHKENT_DISTRICTS — Toshkent tumanlari ro'yxati
//         formatPrice()  — Narxni o'zbek formatida ko'rsatish
//         formatDate()   — Sanani o'zbek formatida ko'rsatish
//         generateOTP()  — 6 xonali tasodifiy kod yaratish
//         apiResponse()  — Standart API javob formati
// =============================================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind CSS classlarini birlashtirish va ziddiyatlarni hal qilish
// Misol: cn("px-2 py-1", condition && "bg-red-500", "px-4") → "py-1 bg-red-500 px-4"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Toshkentning barcha 13 ta tumani — dropdown uchun ishlatiladi
// "as const" — TypeScript da literal type sifatida saqlanadi
export const TASHKENT_DISTRICTS = [
  "Yunusobod",
  "Chilonzor",
  "Mirzo Ulugbek",
  "Shayxontohur",
  "Olmazar",
  "Bektemir",
  "Yakkasaroy",
  "Hamza",
  "Uchtepa",
  "Sergeli",
  "Yangihayot",
  "Mirobod",
  "Yashnobod",
] as const;

// Tuman nomlarining TypeScript turi
export type District = (typeof TASHKENT_DISTRICTS)[number];

// Narxni o'zbek formatida ko'rsatish
// Misol: 150000 → "150 000 so'm"
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
}

// Sanani o'zbek formatida ko'rsatish
// Misol: 2024-12-25 → "25-dekabr, 2024-yil"
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// 6 xonali tasodifiy OTP kodi yaratish
// Misol: "847291"
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Barcha API routelar uchun standart javob formati
// success: true/false
// data: qaytariladigan ma'lumot
// error: xato xabari
export function apiResponse<T>(
  data?: T,
  error?: string,
  status = 200
): Response {
  return Response.json(
    { success: !error, data, error },
    { status: error ? (status === 200 ? 400 : status) : status }
  );
}
