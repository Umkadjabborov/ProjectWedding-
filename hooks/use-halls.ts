// =============================================================
// FAYL: hooks/use-halls.ts
// MAQSAD: To'yxonalar bilan ishlash uchun custom React hooklar.
//         TanStack Query (React Query v5) ishlatiladi.
//         useHalls()      — filtrlangan zallar ro'yxati
//         useHall()       — bitta zal ma'lumoti
//         useCreateHall() — yangi zal yaratish
//         useUpdateHall() — zalni tahrirlash
//         useApproveHall() — zalni tasdiqlash (admin)
//         useDeleteHall() — zalni o'chirish (admin)
//         useAssignOwner() — zalga ega tayinlash (admin)
// =============================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { HallFilters, HallType, ApiResponse } from "@/types";

// Zallar ro'yxatini API dan olish — filter parametrlari URL ga qo'shiladi
async function fetchHalls(filters: HallFilters = {}): Promise<HallType[]> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.district) params.set("district", filters.district);
  if (filters.status) params.set("status", filters.status);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);

  const res = await fetch(`/api/halls?${params}`);
  const json: ApiResponse<HallType[]> = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data!;
}

// Bitta zalning to'liq ma'lumotini olish (singers, cars, bookings bilan)
async function fetchHall(id: string): Promise<HallType> {
  const res = await fetch(`/api/halls/${id}`);
  const json: ApiResponse<HallType> = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data!;
}

// Filtrlangan zallar ro'yxati — queryKey da filters bo'lgani uchun
// filter o'zgarganda avtomatik qayta so'rov yuboriladi
export function useHalls(filters: HallFilters = {}) {
  return useQuery({
    queryKey: ["halls", filters],
    queryFn: () => fetchHalls(filters),
  });
}

// Bitta zal — id bo'lmasa so'rov yuborilmaydi (enabled: !!id)
export function useHall(id: string) {
  return useQuery({
    queryKey: ["hall", id],
    queryFn: () => fetchHall(id),
    enabled: !!id,
  });
}

// Zalni tasdiqlash — muvaffaqiyatdan keyin "halls" cache yangilanadi
export function useApproveHall() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/halls/${id}/approve`, { method: "POST" });
      const json: ApiResponse<HallType> = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data!;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["halls"] }),
  });
}

// Zalni o'chirish — muvaffaqiyatdan keyin "halls" cache yangilanadi
export function useDeleteHall() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/halls/${id}`, { method: "DELETE" });
      const json: ApiResponse<unknown> = await res.json();
      if (!json.success) throw new Error(json.error);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["halls"] }),
  });
}

// Yangi zal yaratish
export function useCreateHall() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) => {
      const res = await fetch("/api/halls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json: ApiResponse<HallType> = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data!;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["halls"] }),
  });
}

// Zalga ega tayinlash — halls va owners cache yangilanadi
export function useAssignOwner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ hallId, ownerId }: { hallId: string; ownerId: string }) => {
      const res = await fetch("/api/owners/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hallId, ownerId }),
      });
      const json: ApiResponse<unknown> = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["halls"] });
      qc.invalidateQueries({ queryKey: ["owners"] });
    },
  });
}

// Zalni tahrirlash — halls va bitta hall cache yangilanadi
export function useUpdateHall(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) => {
      const res = await fetch(`/api/halls/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json: ApiResponse<HallType> = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["halls"] });
      qc.invalidateQueries({ queryKey: ["hall", id] });
    },
  });
}
