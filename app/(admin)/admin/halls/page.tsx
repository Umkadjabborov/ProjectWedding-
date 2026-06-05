"use client";

import { useState } from "react";
import { useHalls, useApproveHall, useDeleteHall } from "@/hooks/use-halls";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DistrictSelect } from "@/components/shared/district-select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils";
import { Plus, Check, Trash2, Eye, Pencil } from "lucide-react";
import Link from "next/link";
import type { HallType, HallFilters } from "@/types";
import { toast } from "@/hooks/use-toast";
import { TableSkeleton } from "@/components/shared/skeletons";

export default function AdminHallsPage() {
  const [filters, setFilters] = useState<HallFilters>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: halls, isLoading } = useHalls(filters);
  const approve = useApproveHall();
  const deleteHall = useDeleteHall();

  const columns: Column<HallType>[] = [
    { key: "name", header: "Nomi", sortable: true },
    { key: "district", header: "Tuman", sortable: true },
    { key: "capacity", header: "Sig'im", sortable: true, render: (r) => `${r.capacity} kishi` },
    { key: "pricePerSeat", header: "Narx/kishi", sortable: true, render: (r) => formatPrice(r.pricePerSeat) },
    { key: "status", header: "Holat", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "owner", header: "Egasi",
      render: (r) => r.owner ? `${r.owner.firstName} ${r.owner.lastName}` : "—",
    },
    {
      key: "actions", header: "Amallar",
      render: (r) => (
        <div className="flex gap-2">
          <Link href={`/admin/halls/${r.id}`}>
            <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
          </Link>
          <Link href={`/admin/halls/${r.id}/edit`}>
            <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
          </Link>
          {r.status === "PENDING" && (
            <Button
              variant="ghost" size="icon"
              onClick={() => approve.mutate(r.id, {
                onSuccess: () => toast({ title: "Tasdiqlandi!", variant: "success" }),
              })}
            >
              <Check className="h-4 w-4 text-emerald-600" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-playfair">Zallar</h1>
        <Link href="/admin/halls/new">
          <Button><Plus className="h-4 w-4 mr-2" /> Yangi zal</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Qidirish..."
          className="w-48"
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value || undefined }))}
        />
        <DistrictSelect
          value={filters.district}
          onValueChange={(v) => setFilters((f) => ({ ...f, district: v === "all" ? undefined : v }))}
          includeAll
        />
        <Select onValueChange={(v) => setFilters((f) => ({ ...f, status: v === "all" ? undefined : v as HallFilters["status"] }))}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Holat" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barchasi</SelectItem>
            <SelectItem value="APPROVED">Tasdiqlangan</SelectItem>
            <SelectItem value="PENDING">Kutilmoqda</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(v) => {
          const [sortBy, sortOrder] = v.split("-") as [HallFilters["sortBy"], "asc" | "desc"];
          setFilters((f) => ({ ...f, sortBy, sortOrder }));
        }}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Saralash" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="pricePerSeat-asc">Narx: arzon</SelectItem>
            <SelectItem value="pricePerSeat-desc">Narx: qimmat</SelectItem>
            <SelectItem value="capacity-asc">Sig'im: kichik</SelectItem>
            <SelectItem value="capacity-desc">Sig'im: katta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable data={halls ?? []} columns={columns} loading={isLoading} />

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Zalni o'chirish</DialogTitle></DialogHeader>
          <p className="text-muted-foreground">Haqiqatan ham bu zalni o'chirmoqchimisiz?</p>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Bekor</Button>
            <Button
              variant="destructive"
              loading={deleteHall.isPending}
              onClick={() => deleteHall.mutate(deleteId!, {
                onSuccess: () => { setDeleteId(null); toast({ title: "O'chirildi", variant: "success" }); },
                onError: (e) => toast({ title: e.message, variant: "destructive" }),
              })}
            >
              O'chirish
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
