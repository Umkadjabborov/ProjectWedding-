"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Users, Banknote, ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { HallType } from "@/types";

export function HallCard({ hall, index = 0 }: { hall: HallType; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
      className="group relative rounded-2xl overflow-hidden bg-card border border-border/50 shadow-luxury hover:shadow-luxury-hover transition-all duration-400"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={hall.images?.[0]?.startsWith("http") ? hall.images[0] : "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800"}
          alt={hall.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />

        {/* District badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            <MapPin className="h-3 w-3" />
            {hall.district}
          </span>
        </div>

        {/* Price badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center bg-gold/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-gold">
            {formatPrice(hall.pricePerSeat)}/kishi
          </span>
        </div>

        {/* Bottom info on image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-playfair font-semibold text-xl leading-tight mb-1 drop-shadow-sm">
            {hall.name}
          </h3>
          <div className="flex items-center gap-1 text-white/70 text-xs">
            <Users className="h-3 w-3" />
            <span>{hall.capacity} kishi sig'adi</span>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Narx</p>
            <p className="text-lg font-bold text-gold font-playfair">
              {formatPrice(hall.pricePerSeat)}
              <span className="text-xs font-normal text-muted-foreground ml-1">/kishi</span>
            </p>
          </div>

          <Link
            href={`/halls/${hall.id}`}
            className="group/btn inline-flex items-center gap-1.5 bg-gradient-to-br from-gold to-gold-dark text-white text-sm font-medium px-4 py-2 rounded-xl shadow-gold hover:shadow-gold-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Bron qilish
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      {/* Gold accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}
