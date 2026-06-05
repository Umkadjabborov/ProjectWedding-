"use client";

import React, { useRef, useState } from "react";
import { Upload, X, Link, Plus } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  className?: string;
}

const CLOUDINARY_CONFIGURED =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME !== "your-cloud-name";

export function ImageUploader({ value, onChange, maxFiles = 10, className }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [tab, setTab] = useState<"file" | "url">(CLOUDINARY_CONFIGURED ? "file" : "url");

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    const remaining = maxFiles - value.length;
    const toUpload = Array.from(files).slice(0, remaining);

    setUploading(true);
    try {
      const formData = new FormData();
      toUpload.forEach((f) => formData.append("files", f));
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (json.success) {
        onChange([...value, ...json.data.urls]);
      }
    } finally {
      setUploading(false);
    }
  };

  const addUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (value.length >= maxFiles) return;
    // oddiy URL validatsiya
    try {
      new URL(trimmed);
    } catch {
      return;
    }
    onChange([...value, trimmed]);
    setUrlInput("");
  };

  const remove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
        {CLOUDINARY_CONFIGURED && (
          <button
            type="button"
            onClick={() => setTab("file")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              tab === "file" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
            )}
          >
            <Upload className="h-3.5 w-3.5" /> Fayl yuklash
          </button>
        )}
        <button
          type="button"
          onClick={() => setTab("url")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
            tab === "url" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
          )}
        >
          <Link className="h-3.5 w-3.5" /> URL kiritish
        </button>
      </div>

      {/* File upload */}
      {tab === "file" && CLOUDINARY_CONFIGURED && (
        <div
          className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        >
          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Rasmlarni bu yerga tashlang yoki{" "}
            <span className="text-primary font-medium">tanlang</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">Ko&apos;pi bilan {maxFiles} ta rasm</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* URL input */}
      {tab === "url" && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/rasm.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={addUrl}
              disabled={!urlInput.trim() || value.length >= maxFiles}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Rasm URL'ini kiriting va + tugmasini bosing ({value.length}/{maxFiles})
          </p>
        </div>
      )}

      {uploading && (
        <p className="text-sm text-primary animate-pulse">Yuklanmoqda...</p>
      )}

      {/* Previews */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden group border border-border/50">
              <Image
                src={src}
                alt={`Rasm ${i + 1}`}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400";
                }}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3 text-white" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {i + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
