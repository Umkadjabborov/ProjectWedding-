import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BookingCalendar } from "@/components/shared/booking-calendar";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatPrice, formatDate } from "@/lib/utils";
import Image from "next/image";
import { MapPin, Phone, Users, Banknote } from "lucide-react";

export default async function AdminHallDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hall = await prisma.hall.findUnique({
    where: { id },
    include: {
      owner: { select: { firstName: true, lastName: true, email: true, phone: true } },
      singers: true,
      cars: true,
      menuItems: true,
      services: true,
      bookings: {
        where: { status: { not: "CANCELLED" } },
        include: { user: { select: { firstName: true, lastName: true, phone: true } } },
      },
    },
  });

  if (!hall) notFound();

  const bookedDates = hall.bookings.map((b) => ({
    date: b.date,
    guestCount: b.guestCount,
    user: b.user,
  }));

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-playfair">{hall.name}</h1>
        <StatusBadge status={hall.status} />
      </div>

      {/* Images */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {hall.images.map((img, i) => (
          <div key={i} className="relative aspect-video rounded-xl overflow-hidden">
            <Image src={img} alt={`${hall.name} ${i + 1}`} fill className="object-cover" />
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{hall.district}, {hall.address}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-primary" />
          <span>{hall.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-primary" />
          <span>{hall.capacity} kishi</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Banknote className="h-4 w-4 text-primary" />
          <span>{formatPrice(hall.pricePerSeat)}/kishi</span>
        </div>
      </div>

      {/* Owner */}
      {hall.owner && (
        <div className="rounded-xl border p-4">
          <h3 className="font-semibold mb-2">Egasi</h3>
          <p>{hall.owner.firstName} {hall.owner.lastName} — {hall.owner.email} — {hall.owner.phone}</p>
        </div>
      )}

      {/* Calendar */}
      <div>
        <h3 className="font-semibold mb-3">Bronlar kalendari</h3>
        <BookingCalendar bookedDates={bookedDates} disablePast={false} />
      </div>
    </div>
  );
}
