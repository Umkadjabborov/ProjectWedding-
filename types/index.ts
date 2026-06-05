// =============================================================
// FAYL: types/index.ts
// MAQSAD: Loyiha bo'ylab ishlatiladigan TypeScript interfeyslari
//         va turlari. Prisma dan import qilingan enumlar ham
//         shu yerdan re-export qilinadi.
//         NextAuth Session turi ham shu yerda kengaytiriladi.
// =============================================================

import type { UserRole, HallStatus, BookingStatus, ServiceType } from "@prisma/client";

// Prisma enumlarini re-export qilish — boshqa fayllar shu yerdan import qiladi
export type { UserRole, HallStatus, BookingStatus, ServiceType };

// ---------------------------------------------------------------
// Foydalanuvchi interfeysi
// password maydoni yo'q — xavfsizlik uchun
// ---------------------------------------------------------------
export interface UserType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone?: string | null;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
}

// ---------------------------------------------------------------
// Xonanda interfeysi
// ---------------------------------------------------------------
export interface SingerType {
  id: string;
  hallId: string;
  name: string;
  price: number;
  image: string;
}

// ---------------------------------------------------------------
// Mashina interfeysi
// ---------------------------------------------------------------
export interface CarType {
  id: string;
  hallId: string;
  brand: string;
  price: number;
  image: string;
}

// ---------------------------------------------------------------
// Menyu elementi interfeysi
// ---------------------------------------------------------------
export interface MenuItemType {
  id: string;
  hallId: string;
  name: string;
  image: string;
}

// ---------------------------------------------------------------
// Qo'shimcha xizmat interfeysi (Karnay va boshqalar)
// ---------------------------------------------------------------
export interface AdditionalServiceType {
  id: string;
  hallId: string;
  name: string;
  price: number;
  type: ServiceType;
}

// ---------------------------------------------------------------
// To'yxona interfeysi
// owner, services, singers, cars, menuItems, bookings — optional
// chunki ba'zi so'rovlarda include qilinmaydi
// ---------------------------------------------------------------
export interface HallType {
  id: string;
  name: string;
  images: string[];
  district: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  capacity: number;
  pricePerSeat: number;
  phone: string;
  status: HallStatus;
  ownerId: string;
  createdAt: Date;
  owner?: UserType;
  services?: AdditionalServiceType[];
  singers?: SingerType[];
  cars?: CarType[];
  menuItems?: MenuItemType[];
  bookings?: BookingType[];
}

// ---------------------------------------------------------------
// Bron qilingan xizmat interfeysi (JSON da saqlanadi)
// ---------------------------------------------------------------
export interface SelectedService {
  id: string;
  name: string;
  price: number;
  type: string;
}

// ---------------------------------------------------------------
// Bron interfeysi
// ---------------------------------------------------------------
export interface BookingType {
  id: string;
  hallId: string;
  userId: string;
  date: Date;
  guestCount: number;
  totalPrice: number;
  advancePayment: number;
  status: BookingStatus;
  selectedServices: SelectedService[];
  createdAt: Date;
  hall?: HallType;
  user?: UserType;
}

// ---------------------------------------------------------------
// Standart API javob formati
// success: true — data mavjud, false — error mavjud
// ---------------------------------------------------------------
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ---------------------------------------------------------------
// Sahifalash uchun umumiy interfeys
// ---------------------------------------------------------------
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ---------------------------------------------------------------
// Zallar filtri parametrlari
// ---------------------------------------------------------------
export interface HallFilters {
  search?: string;
  district?: string;
  status?: HallStatus;
  sortBy?: "pricePerSeat" | "capacity" | "createdAt";
  sortOrder?: "asc" | "desc";
}

// ---------------------------------------------------------------
// Bronlar filtri parametrlari
// ---------------------------------------------------------------
export interface BookingFilters {
  hallId?: string;
  district?: string;
  status?: BookingStatus;
  sortOrder?: "asc" | "desc";
}

// ---------------------------------------------------------------
// NextAuth Session turini kengaytirish
// Default Session.user da id, role, isVerified yo'q
// Shu yerda qo'shamiz
// ---------------------------------------------------------------
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      isVerified: boolean;
    };
  }
}
