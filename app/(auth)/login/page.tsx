"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Crown, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/lib/validations";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { motion } from "framer-motion";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!result) {
        toast({ title: "Ulanishda xato yuz berdi", variant: "destructive" });
        return;
      }

      if (result.error) {
        toast({ title: "Email yoki parol noto'g'ri", variant: "destructive" });
        return;
      }

      // Session yangilanishini kutish
      await new Promise((r) => setTimeout(r, 300));

      // Session dan role olish
      const sessionRes = await fetch("/api/auth/session", { cache: "no-store" });
      const session = await sessionRes.json();
      const role = session?.user?.role;

      if (role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (role === "OWNER") {
        router.push("/owner/dashboard");
      } else {
        router.push("/halls");
      }

      router.refresh();
    } catch {
      toast({ title: "Xato yuz berdi, qayta urinib ko'ring", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 hero-pattern" />
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-rose/15 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center mx-auto mb-8 shadow-gold-lg animate-float">
            <Crown className="h-10 w-10 text-white" />
          </div>
          <h1 className="font-playfair text-5xl font-bold text-white mb-4">
            To&apos;yxona
          </h1>
          <p className="text-white/60 text-lg max-w-sm">
            Toshkentdagi eng yaxshi to&apos;yxonalarni online bron qiling
          </p>

          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            {[
              { value: "50+", label: "To'yxona" },
              { value: "1000+", label: "Bron" },
              { value: "13", label: "Tuman" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <p className="font-playfair text-2xl font-bold text-gold">{stat.value}</p>
                <p className="text-white/60 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-gold">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <span className="font-playfair font-bold text-xl">To&apos;yxona</span>
          </div>

          <div className="mb-8">
            <h2 className="font-playfair text-3xl font-bold mb-2">Xush kelibsiz</h2>
            <p className="text-muted-foreground">Hisobingizga kiring</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Email manzil</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="email@example.com"
                  className="pl-10"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Parol</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="pl-10"
                  autoComplete="current-password"
                />
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full h-12 text-base" loading={loading}>
              {loading ? "Kirilmoqda..." : "Kirish"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <div className="divider-gold" />

          <p className="text-center text-sm text-muted-foreground">
            Hisobingiz yo&apos;qmi?{" "}
            <Link href="/register" className="text-gold font-semibold hover:underline">
              Ro&apos;yxatdan o&apos;ting
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-2xl bg-muted/60 border border-border/60">
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              Demo kirish ma&apos;lumotlari
            </p>
            <div className="space-y-2">
              {[
                { role: "Admin", email: "admin@toyxona.uz", pass: "Admin1234!" },
                { role: "Ega", email: "owner1@toyxona.uz", pass: "Owner1234!" },
                { role: "Foydalanuvchi", email: "user1@gmail.com", pass: "User1234!" },
              ].map((cred) => (
                <button
                  key={cred.role}
                  type="button"
                  onClick={() => onSubmit({ email: cred.email, password: cred.pass })}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-foreground">{cred.role}: </span>
                      <span className="text-xs text-muted-foreground">{cred.email}</span>
                    </div>
                    <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
