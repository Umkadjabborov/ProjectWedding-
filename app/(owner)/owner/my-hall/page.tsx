"use client";

import { useSession } from "next-auth/react";
import { useHalls } from "@/hooks/use-halls";
import { HallForm } from "@/components/admin/hall-form";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function OwnerMyHallPage() {
  const { data: session } = useSession();
  const { data: halls, isLoading } = useHalls({});
  const [showForm, setShowForm] = useState(false);

  if (isLoading) return <div className="h-64 rounded-xl bg-muted animate-pulse" />;

  const myHalls = halls ?? [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-playfair">Mening zalim</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Yopish" : "Yangi zal"}
        </Button>
      </div>

      {showForm && <HallForm isOwner />}

      {myHalls.length === 0 && !showForm && (
        <div className="text-center py-16 text-muted-foreground">
          <p>Hali zal qo'shilmagan. Yangi zal qo'shing.</p>
        </div>
      )}

      {myHalls.map((hall) => (
        <div key={hall.id} className="rounded-xl border p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{hall.name}</h2>
            <StatusBadge status={hall.status} />
          </div>
          <p className="text-muted-foreground">{hall.district} — {hall.address}</p>
          <p className="text-sm">{hall.capacity} kishi · {formatPrice(hall.pricePerSeat)}/kishi</p>
          {hall.status === "PENDING" && (
            <p className="text-sm text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
              ⏳ Zalingiz admin tomonidan tasdiqlanishini kuting
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
