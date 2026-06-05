"use client";

import { HallForm } from "@/components/admin/hall-form";

export default function NewHallPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold font-playfair">Yangi zal qo'shish</h1>
      <HallForm />
    </div>
  );
}
