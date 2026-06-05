"use client";

import React from "react";
import { useHall } from "@/hooks/use-halls";
import { HallForm } from "@/components/admin/hall-form";

export default function EditHallPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { data: hall, isLoading } = useHall(resolvedParams.id);

  if (isLoading) return <div className="h-64 rounded-xl bg-muted animate-pulse" />;
  if (!hall) return <p>Zal topilmadi</p>;

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold font-playfair">Zalni tahrirlash</h1>
      <HallForm hall={hall} />
    </div>
  );
}
