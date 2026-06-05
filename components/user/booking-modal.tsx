"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBookingStore } from "@/store/booking-store";
import { useCreateBooking } from "@/hooks/use-bookings";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import type { HallType } from "@/types";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginForm = z.infer<typeof loginSchema>;

export function BookingModal({ hall }: { hall: HallType }) {
  const { data: session } = useSession();
  const {
    isBookingModalOpen, closeBookingModal,
    selectedDate, guestCount, setGuestCount,
    selectedServices, toggleService,
    getTotalPrice, getAdvancePayment,
  } = useBookingStore();

  const [step, setStep] = useState<"booking" | "login" | "pay">("booking");
  const [paying, setPaying] = useState(false);
  const createBooking = useCreateBooking();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const allServices = [
    ...(hall.singers ?? []).map((s) => ({ id: s.id, name: s.name, price: s.price, type: "SINGER" })),
    ...(hall.cars ?? []).map((c) => ({ id: c.id, name: c.brand, price: c.price, type: "CAR" })),
    ...(hall.services ?? []).filter((s) => s.type === "KARNAY").map((s) => ({ id: s.id, name: s.name, price: s.price, type: "KARNAY" })),
  ];

  const handleLogin = async (data: LoginForm) => {
    const result = await signIn("credentials", { ...data, redirect: false });
    if (result?.error) {
      toast({ title: "Login yoki parol noto'g'ri", variant: "destructive" });
    } else {
      await new Promise((r) => setTimeout(r, 300));
      const sessionRes = await fetch("/api/auth/session", { cache: "no-store" });
      const session = await sessionRes.json();
      if (session?.user) {
        setStep("pay");
      } else {
        toast({ title: "Session yangilanmadi, qayta urinib ko'ring", variant: "destructive" });
      }
    }
  };

const handlePay = async () => {
    if (!selectedDate) return;
    if (!session?.user) {
      toast({ title: "Avval tizimga kiring", variant: "destructive" });
      setStep("login");
      return;
    }
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1500)); // simulate payment
    try {
      await createBooking.mutateAsync({
        hallId: hall.id,
        date: selectedDate.toISOString(),
        guestCount,
        selectedServices,
      });
      toast({ title: "Muvaffaqiyatli to'landi! 🎉", description: "Bronningiz tasdiqlandi.", variant: "success" });
      closeBookingModal();
      setStep("booking");
    } catch (e) {
      toast({ title: (e as Error).message, variant: "destructive" });
    } finally {
      setPaying(false);
    }
  };

  const handleBookNow = () => {
    if (!session) setStep("login");
    else setStep("pay");
  };

  const total = getTotalPrice();
  const advance = getAdvancePayment();

  return (
    <Dialog open={isBookingModalOpen} onOpenChange={() => { closeBookingModal(); setStep("booking"); }}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        {step === "booking" && (
          <>
            <DialogHeader>
              <DialogTitle>Bron qilish</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedDate && (
                <div className="rounded-lg bg-muted p-3 text-sm">
                  <span className="font-medium">Sana: </span>{formatDate(selectedDate)}
                </div>
              )}

              <div className="space-y-1">
                <Label>Mehmonlar soni (max: {hall.capacity})</Label>
                <Input
                  type="number"
                  min={1}
                  max={hall.capacity}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Math.min(Number(e.target.value), hall.capacity))}
                />
              </div>

              {allServices.length > 0 && (
                <div className="space-y-2">
                  <Label>Qo'shimcha xizmatlar</Label>
                  {allServices.map((svc) => {
                    const selected = selectedServices.some((s) => s.id === svc.id);
                    return (
                      <label key={svc.id} className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleService(svc)}
                            className="h-4 w-4 rounded"
                          />
                          <span className="text-sm">{svc.name}</span>
                        </div>
                        <span className="text-sm text-primary font-medium">{formatPrice(svc.price)}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              <div className="rounded-xl border p-4 space-y-2 bg-muted/30">
                <div className="flex justify-between text-sm">
                  <span>{guestCount} × {formatPrice(hall.pricePerSeat)}</span>
                  <span>{formatPrice(guestCount * hall.pricePerSeat)}</span>
                </div>
                {selectedServices.map((s) => (
                  <div key={s.id} className="flex justify-between text-sm">
                    <span>{s.name}</span>
                    <span>{formatPrice(s.price)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Jami</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-primary font-bold">
                  <span>Avans (20%)</span>
                  <span>{formatPrice(advance)}</span>
                </div>
              </div>

              <Button className="w-full" onClick={handleBookNow}>
                Bron qilish
              </Button>
            </div>
          </>
        )}

        {step === "login" && (
          <>
            <DialogHeader>
              <DialogTitle>Tizimga kiring</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
              <div className="space-y-1">
                <Label>Email</Label>
                <Input type="email" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Parol</Label>
                <Input type="password" {...register("password")} />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full">Kirish</Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("booking")}>
                Orqaga
              </Button>
            </form>
          </>
        )}

        {step === "pay" && (
          <>
            <DialogHeader>
              <DialogTitle>To'lov</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-xl border p-4 space-y-2 bg-muted/30">
                <p className="text-sm text-muted-foreground">Jami summa</p>
                <p className="text-2xl font-bold">{formatPrice(total)}</p>
                <div className="border-t pt-2">
                  <p className="text-sm text-muted-foreground">Avans to'lovi (20%)</p>
                  <p className="text-xl font-bold text-primary">{formatPrice(advance)}</p>
                </div>
              </div>
              <Button className="w-full" loading={paying} onClick={handlePay}>
                Avans to'lash
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setStep("booking")}>
                Orqaga
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
