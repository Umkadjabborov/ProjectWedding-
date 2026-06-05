"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/shared/image-uploader";
import { DistrictSelect } from "@/components/shared/district-select";
import { MapPreview } from "@/components/shared/map-preview";
import { ServiceForm } from "@/components/shared/service-form";
import { useCreateHall, useUpdateHall } from "@/hooks/use-halls";
import { toast } from "@/hooks/use-toast";
import type { HallType } from "@/types";

const schema = z.object({
  name: z.string().min(2),
  district: z.string().min(1),
  address: z.string().min(5),
  latitude: z.preprocess(
    (val) => val === "" || val === undefined || val === null ? undefined : Number(val),
    z.number().optional()
  ),
  longitude: z.preprocess(
    (val) => val === "" || val === undefined || val === null ? undefined : Number(val),
    z.number().optional()
  ),
  capacity: z.coerce.number().int().positive(),
  pricePerSeat: z.coerce.number().positive(),
  phone: z.string().regex(/^\+998\d{9}$/),
  images: z.array(z.string()).min(1),
  singers: z.array(z.object({ name: z.string(), price: z.coerce.number(), image: z.string() })).default([]),
  cars: z.array(z.object({ brand: z.string(), price: z.coerce.number(), image: z.string() })).default([]),
  menuItems: z.array(z.object({ name: z.string(), image: z.string() })).default([]),
  karnayEnabled: z.boolean().default(false),
  karnayPrice: z.coerce.number().optional(),
  ownerId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface HallFormProps {
  hall?: HallType;
  isOwner?: boolean;
}

export function HallForm({ hall, isOwner }: HallFormProps) {
  const router = useRouter();
  const create = useCreateHall();
  const update = useUpdateHall(hall?.id ?? "");

  const karnayService = hall?.services?.find((s) => s.type === "KARNAY");

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: hall?.name ?? "",
      district: hall?.district ?? "",
      address: hall?.address ?? "",
      capacity: hall?.capacity ?? 100,
      pricePerSeat: hall?.pricePerSeat ?? 100000,
      phone: hall?.phone ?? "+998",
      images: hall?.images ?? [],
      singers: hall?.singers ?? [],
      cars: hall?.cars ?? [],
      menuItems: hall?.menuItems ?? [],
      karnayEnabled: !!karnayService,
      karnayPrice: karnayService?.price,
      latitude: hall?.latitude,
      longitude: hall?.longitude,
    },
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = methods;
  const karnayEnabled = watch("karnayEnabled");
  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const locationQuery = latitude && longitude ? `${latitude}, ${longitude}` : `${watch("district")}, ${watch("address")}`;

  const onSubmit = async (data: FormValues) => {
    const payload = {
      ...data,
      karnayPrice: data.karnayEnabled ? data.karnayPrice : undefined,
    };

    try {
      if (hall) {
        await update.mutateAsync(payload);
        toast({ title: "Zal yangilandi!", variant: "success" });
      } else {
        await create.mutateAsync(payload);
        toast({ title: "Zal qo'shildi!", variant: "success" });
      }
      router.push(isOwner ? "/owner/my-hall" : "/admin/halls");
    } catch (e) {
      toast({ title: (e as Error).message, variant: "destructive" });
    }
  };

  const isPending = create.isPending || update.isPending;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Asosiy ma'lumotlar</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Zal nomi *</Label>
                <Input {...register("name")} placeholder="Guliston To'yxonasi" />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Tuman *</Label>
                <DistrictSelect
                  value={watch("district")}
                  onValueChange={(v) => setValue("district", v)}
                />
                {errors.district && <p className="text-xs text-destructive">{errors.district.message}</p>}
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label>Manzil *</Label>
                <Input {...register("address")} placeholder="Ko'cha, uy raqami" />
                {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Latitude</Label>
                <Input type="number" step="any" {...register("latitude")} placeholder="41.312" />
              </div>
              <div className="space-y-1">
                <Label>Longitude</Label>
                <Input type="number" step="any" {...register("longitude")} placeholder="69.278" />
              </div>
              <div className="space-y-1">
                <Label>Sig'im (kishi) *</Label>
                <Input type="number" {...register("capacity")} />
                {errors.capacity && <p className="text-xs text-destructive">{errors.capacity.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Narx/kishi (so'm) *</Label>
                <Input type="number" {...register("pricePerSeat")} />
                {errors.pricePerSeat && <p className="text-xs text-destructive">{errors.pricePerSeat.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Telefon *</Label>
                <Input {...register("phone")} placeholder="+998901234567" />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label>Rasmlar * (kamida 1 ta)</Label>
              <ImageUploader
                value={watch("images")}
                onChange={(urls) => setValue("images", urls)}
              />
              {errors.images && <p className="text-xs text-destructive">{errors.images.message}</p>}
            </div>

            {(watch("address") || (latitude && longitude)) && (
              <MapPreview
                query={locationQuery}
                title="To'yxona joylashuvi"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Qo'shimcha xizmatlar</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <ServiceForm type="singers" label="Xonandalar" />
            <ServiceForm type="cars" label="Mashinalar" />
            <ServiceForm type="menuItems" label="Menyu" />

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="karnay"
                  checked={karnayEnabled}
                  onChange={(e) => setValue("karnayEnabled", e.target.checked)}
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="karnay" className="text-base font-semibold cursor-pointer">
                  Karnay-Surnay
                </Label>
              </div>
              {karnayEnabled && (
                <div className="space-y-1 ml-7">
                  <Label>Narx (so'm)</Label>
                  <Input type="number" {...register("karnayPrice")} placeholder="800000" className="w-48" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" loading={isPending}>
            {hall ? "Saqlash" : "Qo'shish"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Bekor
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
