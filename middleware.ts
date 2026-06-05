// =============================================================
// FAYL: middleware.ts
// MAQSAD: Next.js middleware — har bir so'rov kelganda ishga
//         tushadi va route himoyasini ta'minlaydi.
//         getToken() ishlatiladi (bcrypt emas) — Edge Runtime da
//         ishlashi uchun. JWT tokendan role o'qiladi.
//
//         Qoidalar:
//         1. Login qilmagan → /admin, /owner, /my-bookings ga kira olmaydi
//         2. Login qilgan  → /login, /register ga kira olmaydi (redirect)
//         3. USER roli     → /admin ga kira olmaydi
//         4. USER roli     → /owner ga kira olmaydi
// =============================================================

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // JWT tokenni cookie dan o'qish (Edge Runtime da ishlaydi)
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Route turlarini aniqlash
  const isAdminRoute = pathname.startsWith("/admin");
  const isOwnerRoute = pathname.startsWith("/owner");
  const isUserProtected = pathname.startsWith("/my-bookings");
  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/verify-otp";

  // 1. Login qilmagan foydalanuvchi himoyalangan routega kirmoqchi
  //    → Login sahifasiga yo'naltirish, callbackUrl saqlanadi
  if (!token && (isAdminRoute || isOwnerRoute || isUserProtected)) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // 2. Login qilgan foydalanuvchi auth sahifasiga kirmoqchi
  //    → Roliga qarab dashboard ga yo'naltirish
  if (token && isAuthRoute) {
    const role = token.role as string;
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    if (role === "OWNER") return NextResponse.redirect(new URL("/owner/dashboard", req.url));
    return NextResponse.redirect(new URL("/halls", req.url));
  }

  // 3. Admin bo'lmagan foydalanuvchi /admin ga kirmoqchi
  if (token && isAdminRoute && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/halls", req.url));
  }

  // 4. Ega bo'lmagan foydalanuvchi /owner ga kirmoqchi
  //    (Admin ham /owner ga kira oladi)
  if (token && isOwnerRoute && token.role !== "OWNER" && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/halls", req.url));
  }

  // Barcha tekshiruvlardan o'tdi — so'rovni davom ettirish
  return NextResponse.next();
}

// Middleware qaysi routelarda ishlashini belgilash
export const config = {
  matcher: [
    "/admin/:path*",      // Barcha admin sahifalari
    "/owner/:path*",      // Barcha owner sahifalari
    "/my-bookings/:path*", // Foydalanuvchi bronlari
    "/login",
    "/register",
    "/verify-otp",
  ],
};
