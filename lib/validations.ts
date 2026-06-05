// =============================================================
// FAYL: lib/validations.ts
// MAQSAD: Zod validatsiya sxemalari — barcha forma va API
//         so'rovlari uchun ma'lumot tekshiruvi.
//         loginSchema    — kirish formasi
//         registerSchema — ro'yxatdan o'tish formasi
//         hallSchema     — zal yaratish/tahrirlash formasi
//         bookingSchema  — bron yaratish
//         otpSchema      — OTP tasdiqlash
//         ownerSchema    — ega yaratish (admin tomonidan)
// =============================================================

import { z } from "zod";

// ---------------------------------------------------------------
// Kirish formasi validatsiyasi
// ---------------------------------------------------------------
export const loginSchema = z.object({
  email: z.string().email("Noto'g'ri email format"),
  password: z.string().min(1, "Parol kiritilishi shart"),
});

// ---------------------------------------------------------------
// Ro'yxatdan o'tish formasi validatsiyasi
// Parol: kamida 8 belgi, 1 katta harf, 1 raqam
// Telefon: O'zbek formati +998XXXXXXXXX (ixtiyoriy)
// ---------------------------------------------------------------
export const registerSchema = z.object({
  firstName: z.string().min(2, "Ism kamida 2 ta harf"),
  lastName: z.string().min(2, "Familiya kamida 2 ta harf"),
  email: z.string().email("Noto'g'ri email format"),
  username: z.string().min(3, "Username kamida 3 ta belgi"),
  password: z
    .string()
    .min(8, "Parol kamida 8 ta belgi")
    .regex(/[A-Z]/, "Kamida 1 ta katta harf")
    .regex(/[0-9]/, "Kamida 1 ta raqam"),
  phone: z
    .string()
    .regex(/^\+998\d{9}$/, "Uzbek format: +998XXXXXXXXX")
    .optional()
    .or(z.literal("")), // Bo'sh string ham qabul qilinadi
  role: z.enum(["ADMIN", "OWNER", "USER"]).default("USER"),
});

// ---------------------------------------------------------------
// Zal yaratish/tahrirlash validatsiyasi
// images: kamida 1, ko'pi bilan 10 ta rasm
// ---------------------------------------------------------------
export const hallSchema = z.object({
  name: z.string().min(2, "Zal nomi kamida 2 ta harf"),
  district: z.string().min(1, "Tuman tanlanishi shart"),
  address: z.string().min(5, "Manzil kamida 5 ta belgi"),
  latitude: z.preprocess(
    (val) => val === "" || val === undefined || val === null ? undefined : Number(val),
    z.number().optional()
  ),
  longitude: z.preprocess(
    (val) => val === "" || val === undefined || val === null ? undefined : Number(val),
    z.number().optional()
  ),
  capacity: z.coerce.number().int().positive("Sig'im musbat son bo'lishi kerak"),
  pricePerSeat: z.coerce.number().positive("Narx musbat son bo'lishi kerak"),
  phone: z.string().regex(/^\+998\d{9}$/, "Uzbek format: +998XXXXXXXXX"),
  images: z.array(z.string()).min(1, "Kamida 1 ta rasm").max(10, "Ko'pi bilan 10 ta rasm"),
});

// ---------------------------------------------------------------
// Bron yaratish validatsiyasi
// date: kelajakdagi sana bo'lishi shart
// selectedServices: tanlangan xizmatlar massivi
// ---------------------------------------------------------------
export const bookingSchema = z.object({
  hallId: z.string().min(1, "Zal ID kiritilishi shart"),
  date: z.string().refine((d) => {
    const date = new Date(d);
    const now = new Date();
    return date >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, "Sana kelajakda bo'lishi shart"),
  guestCount: z.coerce.number().int().positive("Mehmonlar soni musbat bo'lishi kerak"),
  selectedServices: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.coerce.number().nonnegative(),
    type: z.string(),
  })).optional().default([]),
});

// ---------------------------------------------------------------
// OTP tasdiqlash validatsiyasi
// code: aniq 6 ta raqam bo'lishi shart
// ---------------------------------------------------------------
export const otpSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "OTP 6 ta raqamdan iborat"),
});

// ---------------------------------------------------------------
// Admin tomonidan ega yaratish validatsiyasi
// ---------------------------------------------------------------
export const ownerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  username: z.string().min(3),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[0-9]/),
  phone: z.string().regex(/^\+998\d{9}$/).optional().or(z.literal("")),
});
