// =============================================================
// FAYL: hooks/use-toast.ts
// MAQSAD: Yengil toast notification tizimi.
//         Tashqi kutubxonasiz, faqat React state va
//         global listener pattern bilan ishlaydi.
//         toast()    — yangi notification ko'rsatish
//         useToast() — komponentda toastlar ro'yxatini olish
//
//         Variantlar: "default" | "destructive" | "success"
//         Duration: default 4000ms (4 sekund)
// =============================================================

"use client";

import * as React from "react";

type ToastVariant = "default" | "destructive" | "success";

interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

type ToastState = { toasts: ToastData[] };

// Global listener massivi — barcha useToast() hooklar shu yerga subscribe qiladi
const listeners: Array<(state: ToastState) => void> = [];

// Global holat — modul darajasida saqlanadi (React state emas)
let memoryState: ToastState = { toasts: [] };

// Holat o'zgarganda barcha listenerlarni xabardor qilish
function dispatch(action: { type: "ADD" | "REMOVE"; toast?: ToastData; id?: string }) {
  if (action.type === "ADD" && action.toast) {
    // Yangi toast qo'shish, ko'pi bilan 5 ta ko'rsatish
    memoryState = { toasts: [action.toast, ...memoryState.toasts].slice(0, 5) };
  } else if (action.type === "REMOVE") {
    // ID bo'yicha toastni o'chirish
    memoryState = { toasts: memoryState.toasts.filter((t) => t.id !== action.id) };
  }
  listeners.forEach((l) => l(memoryState));
}

// Toast ko'rsatish funksiyasi — komponentdan tashqarida ham chaqirish mumkin
// Misol: toast({ title: "Muvaffaqiyatli!", variant: "success" })
export function toast({ title, description, variant = "default", duration = 4000 }: Omit<ToastData, "id">) {
  const id = Math.random().toString(36).slice(2); // Tasodifiy ID
  dispatch({ type: "ADD", toast: { id, title, description, variant } });
  // duration ms dan keyin avtomatik o'chirish
  setTimeout(() => dispatch({ type: "REMOVE", id }), duration);
}

// React hook — komponentda toastlar ro'yxatini olish
// Subscribe/unsubscribe pattern bilan memory leak oldini oladi
export function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const idx = listeners.indexOf(setState);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);
  return state;
}
