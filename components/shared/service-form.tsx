"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/shared/image-uploader";

interface ServiceFormProps {
  type: "singers" | "cars" | "menuItems";
  label: string;
}

export function ServiceForm({ type, label }: ServiceFormProps) {
  const { control, register, setValue, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: type });

  const addItem = () => {
    if (type === "singers") append({ name: "", price: 0, image: "" });
    else if (type === "cars") append({ brand: "", price: 0, image: "" });
    else append({ name: "", image: "" });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="h-4 w-4 mr-1" /> Qo'shish
        </Button>
      </div>

      {fields.map((field, idx) => (
        <div key={field.id} className="border rounded-xl p-4 space-y-3">
          <div className="flex justify-end">
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(idx)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>

          {type === "singers" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Ism</Label>
                  <Input {...register(`${type}.${idx}.name`)} placeholder="Xonanda ismi" />
                </div>
                <div className="space-y-1">
                  <Label>Narx (so'm)</Label>
                  <Input type="number" {...register(`${type}.${idx}.price`)} placeholder="0" />
                </div>
              </div>
              <ImageUploader
                value={watch(`${type}.${idx}.image`) ? [watch(`${type}.${idx}.image`)] : []}
                onChange={(urls) => setValue(`${type}.${idx}.image`, urls[0] || "")}
                maxFiles={1}
              />
            </>
          )}

          {type === "cars" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Marka</Label>
                  <Input {...register(`${type}.${idx}.brand`)} placeholder="Mercedes-Benz" />
                </div>
                <div className="space-y-1">
                  <Label>Narx (so'm)</Label>
                  <Input type="number" {...register(`${type}.${idx}.price`)} placeholder="0" />
                </div>
              </div>
              <ImageUploader
                value={watch(`${type}.${idx}.image`) ? [watch(`${type}.${idx}.image`)] : []}
                onChange={(urls) => setValue(`${type}.${idx}.image`, urls[0] || "")}
                maxFiles={1}
              />
            </>
          )}

          {type === "menuItems" && (
            <>
              <div className="space-y-1">
                <Label>Taom nomi</Label>
                <Input {...register(`${type}.${idx}.name`)} placeholder="Osh, Manti..." />
              </div>
              <ImageUploader
                value={watch(`${type}.${idx}.image`) ? [watch(`${type}.${idx}.image`)] : []}
                onChange={(urls) => setValue(`${type}.${idx}.image`, urls[0] || "")}
                maxFiles={1}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
