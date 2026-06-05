"use client";

import { useHalls, useApproveHall, useDeleteHall } from "@/hooks/use-halls";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Check, X } from "lucide-react";
import type { HallType } from "@/types";
import { toast } from "@/hooks/use-toast";

export default function ApprovalsPage() {
  const { data: halls, isLoading } = useHalls({ status: "PENDING" });
  const approve = useApproveHall();
  const reject = useDeleteHall();

  const columns: Column<HallType>[] = [
    { key: "name", header: "Nomi" },
    { key: "district", header: "Tuman" },
    { key: "capacity", header: "Sig'im", render: (r) => `${r.capacity} kishi` },
    { key: "pricePerSeat", header: "Narx/kishi", render: (r) => formatPrice(r.pricePerSeat) },
    { key: "status", header: "Holat", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "owner", header: "Egasi",
      render: (r) => r.owner ? `${r.owner.firstName} ${r.owner.lastName}` : "—",
    },
    {
      key: "actions", header: "Amallar",
      render: (r) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => approve.mutate(r.id, {
              onSuccess: () => toast({ title: "Tasdiqlandi!", variant: "success" }),
            })}
          >
            <Check className="h-4 w-4 mr-1" /> Tasdiqlash
          </Button>
          <Button
            size="sm" variant="destructive"
            onClick={() => reject.mutate(r.id, {
              onSuccess: () => toast({ title: "Rad etildi", variant: "success" }),
            })}
          >
            <X className="h-4 w-4 mr-1" /> Rad etish
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-playfair">Tasdiqlash kutilmoqda</h1>
      <DataTable data={halls ?? []} columns={columns} loading={isLoading} emptyMessage="Tasdiqlash kutilayotgan zallar yo'q" />
    </div>
  );
}
