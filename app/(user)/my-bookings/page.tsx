"use client";

import { useState } from "react";
import { useBookings, useCancelBooking } from "@/hooks/use-bookings";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatPrice, formatDate } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import type { BookingType } from "@/types";
import { toast } from "@/hooks/use-toast";

export default function MyBookingsPage() {
  const [cancelId, setCancelId] = useState<string | null>(null);
  const { data: bookings, isLoading } = useBookings({});
  const cancel = useCancelBooking();

  const columns: Column<BookingType>[] = [
    { key: "hall", header: "Zal", render: (r) => r.hall?.name ?? "—" },
    { key: "date", header: "Sana", sortable: true, render: (r) => formatDate(r.date) },
    { key: "guestCount", header: "Mehmonlar", render: (r) => `${r.guestCount} kishi` },
    { key: "totalPrice", header: "Jami", render: (r) => formatPrice(r.totalPrice) },
    { key: "advancePayment", header: "To'langan avans", render: (r) => formatPrice(r.advancePayment) },
    { key: "status", header: "Holat", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions", header: "",
      render: (r) => r.status === "UPCOMING" ? (
        <Button variant="ghost" size="icon" onClick={() => setCancelId(r.id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      ) : null,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold font-playfair">Mening bronlarim</h1>
      <DataTable data={bookings ?? []} columns={columns} loading={isLoading} emptyMessage="Hali bron qilmadingiz" />

      <Dialog open={!!cancelId} onOpenChange={() => setCancelId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Bronni bekor qilish</DialogTitle></DialogHeader>
          <p className="text-muted-foreground">Haqiqatan ham bekor qilmoqchimisiz?</p>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setCancelId(null)}>Yo'q</Button>
            <Button
              variant="destructive"
              loading={cancel.isPending}
              onClick={() => cancel.mutate(cancelId!, {
                onSuccess: () => { setCancelId(null); toast({ title: "Bekor qilindi", variant: "success" }); },
              })}
            >
              Ha, bekor qilish
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
