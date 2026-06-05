// =============================================================
// FAYL: store/booking-store.ts
// MAQSAD: Zustand global bron holati — foydalanuvchi zal
//         sahifasida sana tanlaganda bu store ishga tushadi.
//         Modal ochilishi, mehmonlar soni, xizmatlar tanlash
//         va narx hisoblash shu yerda boshqariladi.
//
//         openBookingModal() — sana tanlanganida chaqiriladi
//         toggleService()    — xizmat qo'shish/olib tashlash
//         getTotalPrice()    — jami narxni hisoblash
//         getAdvancePayment() — avans (20%) ni hisoblash
// =============================================================

import { create } from "zustand";
import type { HallType, SelectedService } from "@/types";

interface BookingState {
  selectedHall: HallType | null;          // Tanlangan zal
  selectedDate: Date | null;              // Tanlangan sana
  guestCount: number;                     // Mehmonlar soni
  selectedServices: SelectedService[];    // Tanlangan xizmatlar
  isBookingModalOpen: boolean;            // Bron modal holati
  isLoginModalOpen: boolean;              // Login modal holati

  setSelectedHall: (hall: HallType | null) => void;
  setSelectedDate: (date: Date | null) => void;
  setGuestCount: (count: number) => void;
  toggleService: (service: SelectedService) => void;
  openBookingModal: (hall: HallType, date: Date) => void;
  closeBookingModal: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  reset: () => void;

  getTotalPrice: () => number;
  getAdvancePayment: () => number;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  selectedHall: null,
  selectedDate: null,
  guestCount: 1,
  selectedServices: [],
  isBookingModalOpen: false,
  isLoginModalOpen: false,

  setSelectedHall: (hall) => set({ selectedHall: hall }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setGuestCount: (count) => set({ guestCount: count }),

  // Xizmat tanlash/bekor qilish — toggle mantiq
  toggleService: (service) =>
    set((s) => {
      const exists = s.selectedServices.find((sv) => sv.id === service.id);
      return {
        selectedServices: exists
          ? s.selectedServices.filter((sv) => sv.id !== service.id) // Olib tashlash
          : [...s.selectedServices, service],                        // Qo'shish
      };
    }),

  // Bron modalini ochish — zal va sana bilan birga
  openBookingModal: (hall, date) =>
    set({ selectedHall: hall, selectedDate: date, isBookingModalOpen: true }),

  // Bron modalini yopish va holatni tozalash
  closeBookingModal: () =>
    set({ isBookingModalOpen: false, selectedDate: null, selectedServices: [], guestCount: 1 }),

  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),

  // Barcha holatni boshlang'ich qiymatga qaytarish
  reset: () =>
    set({
      selectedHall: null,
      selectedDate: null,
      guestCount: 1,
      selectedServices: [],
      isBookingModalOpen: false,
      isLoginModalOpen: false,
    }),

  // Jami narx = (mehmonlar × narx/kishi) + xizmatlar narxi
  getTotalPrice: () => {
    const { selectedHall, guestCount, selectedServices } = get();
    if (!selectedHall) return 0;
    const base = guestCount * selectedHall.pricePerSeat;
    const extras = selectedServices.reduce((sum, s) => sum + s.price, 0);
    return base + extras;
  },

  // Avans = jami narxning 20%
  getAdvancePayment: () => get().getTotalPrice() * 0.2,
}));
