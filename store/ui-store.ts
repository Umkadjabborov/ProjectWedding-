// =============================================================
// FAYL: store/ui-store.ts
// MAQSAD: Zustand global UI holati — tema va sidebar holati.
//         persist middleware bilan localStorage ga saqlanadi,
//         sahifa yangilanganda ham holat saqlanib qoladi.
//         toggleTheme()   — light/dark rejimni almashtirish
//         toggleSidebar() — sidebar ochish/yopish
// =============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  theme: "light" | "dark";   // Joriy tema
  sidebarOpen: boolean;       // Sidebar holati
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  // persist — localStorage ga "ui-store" kaliti bilan saqlaydi
  persist(
    (set) => ({
      theme: "light",
      sidebarOpen: true,

      // Temani almashtirish: light → dark → light
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),

      // Sidebar holatini teskari qilish
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      // Sidebar holatini to'g'ridan-to'g'ri o'rnatish
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    { name: "ui-store" } // localStorage kalit nomi
  )
);
