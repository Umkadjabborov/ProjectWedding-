export function normalizePrismaValue(value: unknown): unknown {
  if (typeof value === "bigint") return Number(value);
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(normalizePrismaValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [key, normalizePrismaValue(val)])
    );
  }
  return value;
}

export function normalizeHall(hall: any) {
  if (!hall) return hall;

  const images = (hall.hallImages ?? [])
    .slice()
    .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((img: any) => img.url);

  const services = hall.karnayEnabled
    ? [
        {
          id: "karnay",
          name: "Karnay-Surnay",
          price: Number(hall.karnayPrice ?? 0),
          type: "KARNAY",
        },
      ]
    : [];

  const normalized = {
    ...hall,
    images,
    services,
    bookings: (hall.bookings ?? []).map((booking: any) => {
      const normalizedBooking = {
        ...booking,
        date: booking.bookingDate,
      };
      delete normalizedBooking.bookingDate;
      return normalizedBooking;
    }),
    karnayPrice: hall.karnayPrice === null ? undefined : Number(hall.karnayPrice ?? undefined),
  };

  delete normalized.hallImages;
  delete normalized.karnayEnabled;

  return normalizePrismaValue(normalized);
}

export function normalizeBooking(booking: any) {
  if (!booking) return booking;

  const selectedServices = (booking.bookingServices ?? []).map((service: any) => ({
    id: String(service.id),
    name: service.serviceName,
    price: Number(service.price),
    type: service.serviceType,
  }));

  const hall = booking.hall
    ? {
        ...booking.hall,
        images: (booking.hall.hallImages ?? []).map((img: any) => img.url),
      }
    : undefined;

  const normalized = {
    ...booking,
    date: booking.bookingDate,
    selectedServices,
    hall,
  };

  delete normalized.bookingServices;
  delete normalized.bookingDate;
  if (normalized.hall) delete normalized.hall.hallImages;

  return normalizePrismaValue(normalized);
}
