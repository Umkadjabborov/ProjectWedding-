"use client";

import { useState, useEffect } from "react";
import { useHalls } from "@/hooks/use-halls";
import { HallCard } from "@/components/user/hall-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DistrictSelect } from "@/components/shared/district-select";
import { Search, SlidersHorizontal, Sparkles, Mic2, Car, Building2 } from "lucide-react";
import type { HallFilters } from "@/types";
import { motion } from "framer-motion";
import { HallCardSkeletonGrid } from "@/components/shared/skeletons";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Singer {
  id: string;
  name: string;
  price: number;
  image: string;
  hall: { id: string; name: string };
}

interface CarItem {
  id: string;
  brand: string;
  price: number;
  image: string;
  hall: { id: string; name: string };
}

function SectionSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden border border-border/50 bg-card">
          <div className="aspect-square animate-shimmer" />
          <div className="p-3 space-y-2">
            <div className="h-4 w-3/4 rounded animate-shimmer" />
            <div className="h-3 w-1/2 rounded animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HallsPage() {
  const [filters, setFilters] = useState<HallFilters>({});
  const { data: halls, isLoading } = useHalls(filters);

  const [singers, setSingers] = useState<Singer[]>([]);
  const [cars, setCars] = useState<CarItem[]>([]);
  const [loadingSingers, setLoadingSingers] = useState(true);
  const [loadingCars, setLoadingCars] = useState(true);

  useEffect(() => {
    fetch("/api/singers")
      .then((r) => r.json())
      .then((j) => setSingers(j.data ?? []))
      .finally(() => setLoadingSingers(false));

    fetch("/api/cars")
      .then((r) => r.json())
      .then((j) => setCars(j.data ?? []))
      .finally(() => setLoadingCars(false));
  }, []);

  // Takrorlanmaslar uchun unique filter
  const uniqueSingers = singers.filter(
    (s, i, arr) => arr.findIndex((x) => x.name === s.name) === i
  );
  const uniqueCars = cars.filter(
    (c, i, arr) => arr.findIndex((x) => x.brand === c.brand) === i
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-hero-gradient overflow-hidden">
        <div className="absolute inset-0 hero-pattern" />
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-0 left-10 w-48 h-48 rounded-full bg-rose/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 text-gold text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Toshkentning eng yaxshi to&apos;yxonalari
            </div>
            <h1 className="font-playfair text-5xl sm:text-6xl font-bold text-white mb-4 leading-tight">
              Orzuingizdagi{" "}
              <span className="gold-text">to&apos;y</span>
              <br />
              shu yerda boshlanadi
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Toshkentdagi eng chiroyli to&apos;yxonalarni toping va online bron qiling
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters bar */}
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Zal qidirish..."
                className="pl-10 h-10 rounded-xl"
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value || undefined }))}
              />
            </div>

            <div className="w-44">
              <DistrictSelect
                value={filters.district}
                onValueChange={(v) => setFilters((f) => ({ ...f, district: v === "all" ? undefined : v }))}
                includeAll
                placeholder="Tuman"
              />
            </div>

            <Select onValueChange={(v) => {
              const [sortBy, sortOrder] = v.split("-") as [HallFilters["sortBy"], "asc" | "desc"];
              setFilters((f) => ({ ...f, sortBy, sortOrder }));
            }}>
              <SelectTrigger className="w-44 h-10 rounded-xl">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Saralash" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pricePerSeat-asc">Narx: arzon</SelectItem>
                <SelectItem value="pricePerSeat-desc">Narx: qimmat</SelectItem>
                <SelectItem value="capacity-asc">Sig&apos;im: kichik</SelectItem>
                <SelectItem value="capacity-desc">Sig&apos;im: katta</SelectItem>
              </SelectContent>
            </Select>

            {halls && (
              <span className="text-sm text-muted-foreground ml-auto">
                <span className="font-semibold text-foreground">{halls.length}</span> ta zal topildi
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Halls Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {isLoading ? (
          <HallCardSkeletonGrid count={6} />
        ) : halls?.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="font-playfair text-xl font-semibold mb-2">Hech narsa topilmadi</h3>
            <p className="text-muted-foreground">Qidiruv shartlarini o&apos;zgartiring</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {halls?.map((hall, i) => <HallCard key={hall.id} hall={hall} index={i} />)}
          </div>
        )}
      </div>

      {/* ── Singers Section ── */}
      <section className="border-t border-border/60 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-gold">
              <Mic2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-playfair text-2xl font-bold">Xonandalar</h2>
              <p className="text-sm text-muted-foreground">To&apos;yxonalarimizda mavjud xonandalar</p>
            </div>
          </div>

          {loadingSingers ? (
            <SectionSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {uniqueSingers.map((singer, i) => (
                <motion.div
                  key={singer.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group rounded-2xl overflow-hidden border border-border/50 bg-card shadow-luxury hover:shadow-luxury-hover transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={singer.image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"}
                      alt={singer.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3">
                      <p className="text-white font-semibold text-sm truncate">{singer.name}</p>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate">{singer.hall.name}</span>
                    <span className="text-xs font-bold text-gold whitespace-nowrap ml-2">
                      {formatPrice(singer.price)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Cars Section ── */}
      <section className="border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy to-navy/80 flex items-center justify-center shadow-sm border border-border">
              <Car className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h2 className="font-playfair text-2xl font-bold">Kelin-kuyov mashinalari</h2>
              <p className="text-sm text-muted-foreground">To&apos;yxonalarimizda mavjud avtomobillar</p>
            </div>
          </div>

          {loadingCars ? (
            <SectionSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {uniqueCars.map((car, i) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group rounded-2xl overflow-hidden border border-border/50 bg-card shadow-luxury hover:shadow-luxury-hover transition-all duration-300"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={car.image || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400"}
                      alt={car.brand}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3">
                      <p className="text-white font-semibold text-sm truncate">{car.brand}</p>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate">{car.hall.name}</span>
                    <span className="text-xs font-bold text-gold whitespace-nowrap ml-2">
                      {formatPrice(car.price)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── All Halls Section ── */}
      <section className="border-t border-border/60 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center shadow-sm">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-playfair text-2xl font-bold">Barcha to&apos;yxonalar</h2>
              <p className="text-sm text-muted-foreground">Platformamizdagi barcha zallar</p>
            </div>
          </div>

          {isLoading ? (
            <SectionSkeleton count={6} />
          ) : (
            <div className="all-halls-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {halls?.map((hall, i) => (
                <motion.div
                  key={hall.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link
                    href={`/halls/${hall.id}`}
                    className="group block rounded-2xl overflow-hidden border border-border/50 bg-card shadow-luxury hover:shadow-luxury-hover transition-all duration-300"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={hall.images[0] || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800"}
                        alt={hall.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-2 left-3 right-3">
                        <p className="text-white font-semibold text-xs truncate">{hall.name}</p>
                        <p className="text-white/70 text-xs">{hall.district}</p>
                      </div>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{hall.capacity} kishi</span>
                      <span className="text-xs font-bold text-gold">
                        {formatPrice(hall.pricePerSeat)}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
