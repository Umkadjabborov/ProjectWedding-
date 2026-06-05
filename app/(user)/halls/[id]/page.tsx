"use client";

import React, { useState } from "react";
import { useHall } from "@/hooks/use-halls";
import { BookingCalendar } from "@/components/shared/booking-calendar";
import { BookingModal } from "@/components/user/booking-modal";
import { useBookingStore } from "@/store/booking-store";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { MapPin, Phone, Users, Banknote, Music, Car, UtensilsCrossed, Mic2 } from "lucide-react";
import { HallDetailSkeleton } from "@/components/shared/skeletons";
import { MapPreview } from "@/components/shared/map-preview";

export default function HallDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { data: hall, isLoading } = useHall(resolvedParams.id);
  const { openBookingModal } = useBookingStore();
  const [activeImg, setActiveImg] = useState(0);

  if (isLoading) {
    return (
      <div className="pt-16">
        <HallDetailSkeleton />
      </div>
    );
  }

  if (!hall) return <div className="text-center py-16">Zal topilmadi</div>;

  const bookedDates = (hall.bookings ?? []).map((b) => ({
    date: new Date(b.date),
    guestCount: b.guestCount,
    user: b.user,
  }));

  const karnay = hall.services?.find((s) => s.type === "KARNAY");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Image Gallery */}
      <div className="space-y-3">
        <div className="relative aspect-video rounded-xl overflow-hidden">
          <Image
            src={hall.images[activeImg] || "/placeholder.jpg"}
            alt={hall.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        {hall.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {hall.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImg ? "border-primary" : "border-transparent"}`}
              >
                <Image src={img} alt={`${i + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold font-playfair">{hall.name}</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: MapPin, text: `${hall.district}, ${hall.address}` },
            { icon: Phone, text: hall.phone },
            { icon: Users, text: `${hall.capacity} kishi` },
            { icon: Banknote, text: `${formatPrice(hall.pricePerSeat)}/kishi` },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-2 text-sm">
              <Icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Services */}
      {(hall.singers?.length || hall.cars?.length || hall.menuItems?.length || karnay) ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-playfair">Qo'shimcha xizmatlar</h2>

          {hall.singers && hall.singers.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><Mic2 className="h-4 w-4 text-primary" /> Xonandalar</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hall.singers.map((s) => (
                  <div key={s.id} className="rounded-xl border p-3 flex items-center gap-3">
                    {s.image && (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <Image src={s.image} alt={s.name} fill className="object-cover" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm">{s.name}</p>
                      <p className="text-xs text-primary">{formatPrice(s.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hall.cars && hall.cars.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><Car className="h-4 w-4 text-primary" /> Mashinalar</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hall.cars.map((c) => (
                  <div key={c.id} className="rounded-xl border p-3 flex items-center gap-3">
                    {c.image && (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={c.image} alt={c.brand} fill className="object-cover" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm">{c.brand}</p>
                      <p className="text-xs text-primary">{formatPrice(c.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hall.menuItems && hall.menuItems.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><UtensilsCrossed className="h-4 w-4 text-primary" /> Menyu</h3>
              <div className="flex flex-wrap gap-2">
                {hall.menuItems.map((m) => (
                  <span key={m.id} className="px-3 py-1 rounded-full bg-muted text-sm">{m.name}</span>
                ))}
              </div>
            </div>
          )}

          {karnay && (
            <div className="flex items-center gap-2 text-sm">
              <Music className="h-4 w-4 text-primary" />
              <span className="font-medium">Karnay-Surnay:</span>
              <span className="text-primary">{formatPrice(karnay.price)}</span>
            </div>
          )}
        </div>
      ) : null}

      {/* Booking Calendar */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold font-playfair">Bron qilish</h2>
        <p className="text-muted-foreground text-sm">Mavjud sanani tanlang</p>
        <BookingCalendar
          bookedDates={bookedDates}
          onDateClick={(date) => openBookingModal(hall, date)}
        />
        <MapPreview query={`${hall.district}, ${hall.address}`} title="To'yxonaning joylashuvi" />
      </div>

      <BookingModal hall={hall} />
    </div>
  );
}
