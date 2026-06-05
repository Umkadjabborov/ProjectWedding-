"use client";

import { useState } from "react";
import { useBookings, useCancelBooking } from "@/hooks/use-bookings";
import { useHalls } from "@/hooks/use-halls";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DistrictSelect } from "@/components/shared/district-select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatPrice, formatDate } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import type { BookingType, BookingFilters } from "@/types";
import { toast } from "@/hooks/use-toast";

export default function AdminBookingsPage() {
  const [filters, setFilters] = useState<BookingFilters>({});
  const [cancelId, setCancelId] = useState<string | null>(null);
  const { data: bookings, isLoading } = useBookings(filters);
  const { data: halls } = useHalls({});
  const cancel = useCancelBooking();

  const columns: Column<BookingType>[] = [
    { key: "id", header: "ID", render: (r) => r.id.slice(0, 8) + "..." },
    { key: "hall", header: "Zal", render: (r) => r.hall?.name ?? "—" },
    { key: "date", header: "Sana", sortable: true, render: (r) => formatDate(r.date) },
    { key: "guestCount", header: "Mehmonlar", sortable: true, render: (r) => `${r.guestCount} kishi` },
    {
      key: "user", header: "Buyurtmachi",
      render: (r) => r.user ? `${r.user.firstName} ${r.user.lastName} (${r.user.phone ?? "—"})` : "—",
    },
    { key: "totalPrice", header: "Summa", sortable: true, render: (r) => formatPrice(r.totalPrice) },
    { key: "status", header: "Holat", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions", header: "Amallar",
      render: (r) => r.status === "UPCOMING" ? (
        <Button variant="ghost" size="icon" onClick={() => setCancelId(r.id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-playfair">Bronlar</h1>

      <div className="flex flex-wrap gap-3">
        <Select onValueChange={(v) => setFilters((f) => ({ ...f, hallId: v === "all" ? undefined : v }))}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Zal bo'yicha" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barcha zallar</SelectItem>
            {halls?.map((h) => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <DistrictSelect
          value={filters.district}
          onValueChange={(v) => setFilters((f) => ({ ...f, district: v === "all" ? undefined : v }))}
          includeAll
        />
        <Select onValueChange={(v) => setFilters((f) => ({ ...f, status: v === "all" ? undefined : v as BookingFilters["status"] }))}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Holat" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barchasi</SelectItem>
            <SelectItem value="UPCOMING">Kutilmoqda</SelectItem>
            <SelectItem value="COMPLETED">Yakunlangan</SelectItem>
            <SelectItem value="CANCELLED">Bekor qilingan</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(v) => setFilters((f) => ({ ...f, sortOrder: v as "asc" | "desc" }))}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Sana" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Sana: eski</SelectItem>
            <SelectItem value="desc">Sana: yangi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable data={bookings ?? []} columns={columns} loading={isLoading} />

      <Dialog open={!!cancelId} onOpenChange={() => setCancelId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Bronni bekor qilish</DialogTitle></DialogHeader>
          <p className="text-muted-foreground">Haqiqatan ham bu bronni bekor qilmoqchimisiz?</p>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setCancelId(null)}>Yo'q</Button>
            <Button
              variant="destructive"
              loading={cancel.isPending}
              onClick={() => cancel.mutate(cancelId!, {
                onSuccess: () => { setCancelId(null); toast({ title: "Bekor qilindi", variant: "success" }); },
                onError: (e) => toast({ title: e.message, variant: "destructive" }),
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
