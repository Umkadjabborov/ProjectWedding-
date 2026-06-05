// =============================================================
// FAYL: lib/auth.ts
// MAQSAD: NextAuth.js v5 konfiguratsiyasi — JWT asosida
//         autentifikatsiya tizimi. Foydalanuvchi email va parol
//         bilan kiradi, token ichiga role va isVerified saqlanadi.
//         handlers — API route uchun
//         auth      — server componentlarda session olish uchun
//         signIn/signOut — server action uchun
// =============================================================

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Kirish ma'lumotlarini tekshirish uchun Zod sxemasi
const credSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      // HTML forma uchun maydon ta'riflari
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      // Foydalanuvchini tekshirish funksiyasi
      // null qaytarsa — kirish rad etiladi
      async authorize(credentials) {
        // 1. Kirish ma'lumotlarini validatsiya qilish
        const parsed = credSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // 2. Foydalanuvchini bazadan topish
        let user;
        try {
          user = await prisma.user.findUnique({ where: { email } });
        } catch (e) {
          console.error("[AUTH] DB error:", e);
          throw new Error("Database ulanishda xato");
        }

        // 3. Foydalanuvchi topilmasa — null
        if (!user) {
          console.error("[AUTH] User not found:", email);
          return null;
        }

        // 4. Parolni bcrypt bilan solishtirish
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          console.error("[AUTH] Wrong password for:", email);
          return null;
        }

        // 5. Muvaffaqiyatli — foydalanuvchi ma'lumotlarini qaytarish
        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          isVerified: user.isVerified,
        };
      },
    }),
  ],

  callbacks: {
    // JWT token yaratilganda qo'shimcha ma'lumot qo'shish
    // user — faqat birinchi kirishda mavjud
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
        token.isVerified = (user as { isVerified: boolean }).isVerified;
      }
      return token;
    },

    // Session obyektiga token ma'lumotlarini ko'chirish
    // Clientda useSession() orqali olinadi
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.isVerified = token.isVerified as boolean;
      return session;
    },
  },

  // Maxsus sahifalar — default NextAuth sahifalarini o'rniga
  pages: {
    signIn: "/login",  // Kirish sahifasi
    error: "/login",   // Xato bo'lsa ham login sahifasiga
  },

  session: { strategy: "jwt" }, // JWT strategiyasi (DB session emas)
  trustHost: true,               // Localhost va Render uchun host ishonch
});
