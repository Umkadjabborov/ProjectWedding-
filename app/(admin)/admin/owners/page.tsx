"use client";

import { useState } from "react";
import { useOwners, useCreateOwner } from "@/hooks/use-owners";
import { useHalls, useAssignOwner } from "@/hooks/use-halls";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ownerSchema } from "@/lib/validations";
import { formatDate } from "@/lib/utils";
import { Plus, Link2 } from "lucide-react";
import type { UserType } from "@/types";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

type OwnerForm = z.infer<typeof ownerSchema>;

export default function AdminOwnersPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<string>("");
  const [selectedHall, setSelectedHall] = useState<string>("");

  const { data: owners, isLoading } = useOwners();
  const { data: halls } = useHalls({});
  const createOwner = useCreateOwner();
  const assignOwner = useAssignOwner();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<OwnerForm>({
    resolver: zodResolver(ownerSchema),
  });

  const onSubmit = async (data: OwnerForm) => {
    try {
      await createOwner.mutateAsync(data);
      toast({ title: "Ega qo'shildi!", variant: "success" });
      reset();
      setAddOpen(false);
    } catch (e) {
      toast({ title: (e as Error).message, variant: "destructive" });
    }
  };

  const handleAssign = async () => {
    if (!selectedOwner || !selectedHall) return;
    try {
      await assignOwner.mutateAsync({ hallId: selectedHall, ownerId: selectedOwner });
      toast({ title: "Tayinlandi!", variant: "success" });
      setAssignOpen(false);
    } catch (e) {
      toast({ title: (e as Error).message, variant: "destructive" });
    }
  };

  const columns: Column<UserType>[] = [
    { key: "firstName", header: "Ism", render: (r) => `${r.firstName} ${r.lastName}` },
    { key: "email", header: "Email" },
    { key: "phone", header: "Telefon", render: (r) => r.phone ?? "—" },
    { key: "createdAt", header: "Qo'shilgan", render: (r) => formatDate(r.createdAt) },
    {
      key: "actions", header: "Amallar",
      render: (r) => (
        <Button variant="ghost" size="sm" onClick={() => { setSelectedOwner(r.id); setAssignOpen(true); }}>
          <Link2 className="h-4 w-4 mr-1" /> Tayinlash
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-playfair">Egalar</h1>
        <Button onClick={() => setAddOpen(true)}><Plus className="h-4 w-4 mr-2" /> Yangi ega</Button>
      </div>

      <DataTable data={owners ?? []} columns={columns} loading={isLoading} />

      {/* Add Owner Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Yangi ega qo'shish</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Ism</Label>
                <Input {...register("firstName")} />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Familiya</Label>
                <Input {...register("lastName")} />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
              </div>
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Username</Label>
              <Input {...register("username")} />
              {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Parol</Label>
              <Input type="password" {...register("password")} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Telefon</Label>
              <Input {...register("phone")} placeholder="+998901234567" />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Bekor</Button>
              <Button type="submit" loading={createOwner.isPending}>Qo'shish</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Zalga ega tayinlash</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Zal</Label>
              <Select value={selectedHall} onValueChange={setSelectedHall}>
                <SelectTrigger><SelectValue placeholder="Zal tanlang" /></SelectTrigger>
                <SelectContent>
                  {halls?.map((h) => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setAssignOpen(false)}>Bekor</Button>
              <Button loading={assignOwner.isPending} onClick={handleAssign}>Tayinlash</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
