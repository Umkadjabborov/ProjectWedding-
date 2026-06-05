// =============================================================
// FAYL: hooks/use-bookings.ts
// MAQSAD: Bronlar bilan ishlash uchun custom React hooklar.
//         useBookings()      — filtrlangan bronlar ro'yxati
//         useCreateBooking() — yangi bron yaratish
//         useCancelBooking() — bronni bekor qilish
//                             (optimistic update bilan — UI
//                              darhol yangilanadi, server javobini
//                              kutmaydi; xato bo'lsa qaytariladi)
// =============================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { BookingFilters, BookingType, ApiResponse } from "@/types";

// Bronlar ro'yxatini API dan olish
async function fetchBookings(filters: BookingFilters = {}): Promise<BookingType[]> {
  const params = new URLSearchParams();
  if (filters.hallId) params.set("hallId", filters.hallId);
  if (filters.district) params.set("district", filters.district);
  if (filters.status) params.set("status", filters.status);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);

  const res = await fetch(`/api/bookings?${params}`);
  const json: ApiResponse<BookingType[]> = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data!;
}

// Filtrlangan bronlar ro'yxati
export function useBookings(filters: BookingFilters = {}) {
  return useQuery({
    queryKey: ["bookings", filters],
    queryFn: () => fetchBookings(filters),
  });
}

// Bronni bekor qilish — OPTIMISTIC UPDATE bilan
// 1. onMutate: UI da darhol "CANCELLED" ko'rsatiladi
// 2. Server so'rovi yuboriladi
// 3. Xato bo'lsa: onError — eski holat qaytariladi
// 4. Har holda: onSettled — server dan yangi ma'lumot olinadi
export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      const json: ApiResponse<BookingType> = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data!;
    },

    // Optimistic update — server javobini kutmasdan UI ni yangilash
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["bookings"] }); // Ketayotgan so'rovlarni to'xtatish
      const prev = qc.getQueriesData({ queryKey: ["bookings"] }); // Eski ma'lumotni saqlash
      // UI da darhol CANCELLED ko'rsatish
      qc.setQueriesData({ queryKey: ["bookings"] }, (old: BookingType[] | undefined) =>
        old?.map((b) => (b.id === id ? { ...b, status: "CANCELLED" as const } : b))
      );
      return { prev }; // Rollback uchun eski ma'lumot
    },

    // Xato bo'lsa — eski ma'lumotni qaytarish (rollback)
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) {
        ctx.prev.forEach(([key, data]) => qc.setQueryData(key, data));
      }
    },

    // Har holda (xato yoki muvaffaqiyat) — server dan yangilash
    onSettled: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });
}

// Yangi bron yaratish — muvaffaqiyatdan keyin bronlar va zal cache yangilanadi
export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) => {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json: ApiResponse<BookingType> = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
      qc.invalidateQueries({ queryKey: ["hall"] }); // Zal kalendarini yangilash
    },
  });
}
