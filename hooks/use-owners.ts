// =============================================================
// FAYL: hooks/use-owners.ts
// MAQSAD: Egalar bilan ishlash uchun custom React hooklar.
//         useOwners()      — barcha egalar ro'yxati (admin uchun)
//         useCreateOwner() — yangi ega yaratish (admin uchun)
// =============================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserType, ApiResponse } from "@/types";

// Barcha egalar ro'yxatini olish — faqat ADMIN ko'ra oladi
export function useOwners() {
  return useQuery({
    queryKey: ["owners"],
    queryFn: async () => {
      const res = await fetch("/api/owners");
      const json: ApiResponse<UserType[]> = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data!;
    },
  });
}

// Yangi ega yaratish — muvaffaqiyatdan keyin "owners" cache yangilanadi
export function useCreateOwner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) => {
      const res = await fetch("/api/owners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json: ApiResponse<UserType> = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data!;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["owners"] }),
  });
}
