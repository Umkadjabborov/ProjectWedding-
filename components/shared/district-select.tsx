"use client";

import { TASHKENT_DISTRICTS } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DistrictSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  includeAll?: boolean;
}

export function DistrictSelect({ value, onValueChange, placeholder = "Tuman tanlang", includeAll }: DistrictSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {includeAll && <SelectItem value="all">Barcha tumanlar</SelectItem>}
        {TASHKENT_DISTRICTS.map((d) => (
          <SelectItem key={d} value={d}>{d}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
