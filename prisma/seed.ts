import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DISTRICTS = [
  "Yunusobod",
  "Chilonzor",
  "Mirzo Ulugbek",
  "Shayxontohur",
  "Olmazar",
  "Bektemir",
  "Yakkasaroy",
  "Hamza",
  "Uchtepa",
  "Sergeli",
  "Yangihayot",
  "Mirobod",
  "Yashnobod",
];

async function main() {
  // Admin
  const adminPassword = await bcrypt.hash("Admin1234!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@toyxona.uz" },
    update: {},
    create: {
      firstName: "Super",
      lastName: "Admin",
      email: "admin@toyxona.uz",
      username: "superadmin",
      password: adminPassword,
      phone: "+998901234567",
      role: "ADMIN",
      isVerified: true,
    },
  });

  // Owners
  const ownerPassword = await bcrypt.hash("Owner1234!", 12);
  const owner1 = await prisma.user.upsert({
    where: { email: "owner1@toyxona.uz" },
    update: {},
    create: {
      firstName: "Jasur",
      lastName: "Toshmatov",
      email: "owner1@toyxona.uz",
      username: "jasur_owner",
      password: ownerPassword,
      phone: "+998901111111",
      role: "OWNER",
      isVerified: true,
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: "owner2@toyxona.uz" },
    update: {},
    create: {
      firstName: "Dilnoza",
      lastName: "Yusupova",
      email: "owner2@toyxona.uz",
      username: "dilnoza_owner",
      password: ownerPassword,
      phone: "+998902222222",
      role: "OWNER",
      isVerified: true,
    },
  });

  // User
  const userPassword = await bcrypt.hash("User1234!", 12);
  const user1 = await prisma.user.upsert({
    where: { email: "user1@gmail.com" },
    update: {},
    create: {
      firstName: "Bobur",
      lastName: "Karimov",
      email: "user1@gmail.com",
      username: "bobur_user",
      password: userPassword,
      phone: "+998903333333",
      role: "USER",
      isVerified: true,
    },
  });

  // Halls
  const hall1 = await prisma.hall.upsert({
    where: { id: "hall-seed-1" },
    update: {},
    create: {
      id: "hall-seed-1",
      name: "Guliston To'yxonasi",
      images: [
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
      ],
      district: "Yunusobod",
      address: "Yunusobod tumani, 14-mavze, 25-uy",
      capacity: 500,
      pricePerSeat: 150000,
      phone: "+998711234567",
      status: "APPROVED",
      ownerId: owner1.id,
    },
  });

  const hall2 = await prisma.hall.upsert({
    where: { id: "hall-seed-2" },
    update: {},
    create: {
      id: "hall-seed-2",
      name: "Bahor Saroyi",
      images: [
        "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
      ],
      district: "Chilonzor",
      address: "Chilonzor tumani, Bunyodkor ko'chasi, 10-uy",
      capacity: 300,
      pricePerSeat: 120000,
      phone: "+998712345678",
      status: "APPROVED",
      ownerId: owner1.id,
    },
  });

  const hall3 = await prisma.hall.upsert({
    where: { id: "hall-seed-3" },
    update: {},
    create: {
      id: "hall-seed-3",
      name: "Sharq Nuri",
      images: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      ],
      district: "Mirzo Ulugbek",
      address: "Mirzo Ulugbek tumani, Universitet ko'chasi, 5-uy",
      capacity: 400,
      pricePerSeat: 180000,
      phone: "+998713456789",
      status: "APPROVED",
      ownerId: owner2.id,
    },
  });

  const hall4 = await prisma.hall.upsert({
    where: { id: "hall-seed-4" },
    update: {},
    create: {
      id: "hall-seed-4",
      name: "Oltin Zal",
      images: [
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800",
      ],
      district: "Yakkasaroy",
      address: "Yakkasaroy tumani, Amir Temur ko'chasi, 88-uy",
      capacity: 600,
      pricePerSeat: 200000,
      phone: "+998714567890",
      status: "APPROVED",
      ownerId: owner2.id,
    },
  });

  const hall5 = await prisma.hall.upsert({
    where: { id: "hall-seed-5" },
    update: {},
    create: {
      id: "hall-seed-5",
      name: "Yangi Hayot To'yxonasi",
      images: [
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800",
      ],
      district: "Sergeli",
      address: "Sergeli tumani, Yangi hayot ko'chasi, 3-uy",
      capacity: 250,
      pricePerSeat: 100000,
      phone: "+998715678901",
      status: "PENDING",
      ownerId: owner1.id,
    },
  });

  // Additional services for hall1
  await prisma.singer.createMany({
    data: [
      {
        hallId: hall1.id,
        name: "Sherzod Qodirov",
        price: 2000000,
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      },
      {
        hallId: hall1.id,
        name: "Malika Rahimova",
        price: 1500000,
        image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.car.createMany({
    data: [
      {
        hallId: hall1.id,
        brand: "Mercedes-Benz S-Class",
        price: 500000,
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400",
      },
      {
        hallId: hall1.id,
        brand: "BMW 7 Series",
        price: 450000,
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.menuItem.createMany({
    data: [
      { hallId: hall1.id, name: "Osh (Palov)", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400" },
      { hallId: hall1.id, name: "Manti", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400" },
      { hallId: hall1.id, name: "Shashlik", image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400" },
    ],
    skipDuplicates: true,
  });

  await prisma.additionalService.createMany({
    data: [
      { hallId: hall1.id, name: "Karnay-Surnay", price: 800000, type: "KARNAY" },
    ],
    skipDuplicates: true,
  });

  const hall6 = await prisma.hall.upsert({
    where: { id: "hall-seed-6" },
    update: {},
    create: {
      id: "hall-seed-6",
      name: "Navro'z Saroyi",
      images: [
        "https://images.unsplash.com/photo-1561912774-79769a0a0a7a?w=800",
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      ],
      district: "Shayxontohur",
      address: "Shayxontohur tumani, Navoiy ko'chasi, 12-uy",
      capacity: 450,
      pricePerSeat: 160000,
      phone: "+998716789012",
      status: "APPROVED",
      ownerId: owner1.id,
    },
  });

  const hall7 = await prisma.hall.upsert({
    where: { id: "hall-seed-7" },
    update: {},
    create: {
      id: "hall-seed-7",
      name: "Milliy To'yxona",
      images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      ],
      district: "Olmazar",
      address: "Olmazar tumani, Farobiy ko'chasi, 7-uy",
      capacity: 350,
      pricePerSeat: 130000,
      phone: "+998717890123",
      status: "APPROVED",
      ownerId: owner2.id,
    },
  });

  const hall8 = await prisma.hall.upsert({
    where: { id: "hall-seed-8" },
    update: {},
    create: {
      id: "hall-seed-8",
      name: "Durdonа Banquet",
      images: [
        "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
      ],
      district: "Mirobod",
      address: "Mirobod tumani, Mustaqillik ko'chasi, 33-uy",
      capacity: 550,
      pricePerSeat: 220000,
      phone: "+998718901234",
      status: "APPROVED",
      ownerId: owner1.id,
    },
  });

  const hall9 = await prisma.hall.upsert({
    where: { id: "hall-seed-9" },
    update: {},
    create: {
      id: "hall-seed-9",
      name: "Yashnobod Grand",
      images: [
        "https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=800",
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800",
      ],
      district: "Yashnobod",
      address: "Yashnobod tumani, Ipak yo'li ko'chasi, 55-uy",
      capacity: 280,
      pricePerSeat: 110000,
      phone: "+998719012345",
      status: "APPROVED",
      ownerId: owner2.id,
    },
  });

  // Additional services for hall6
  await prisma.singer.createMany({
    data: [
      {
        hallId: hall6.id,
        name: "Ulmas Rahimov",
        price: 1800000,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.car.createMany({
    data: [
      {
        hallId: hall6.id,
        brand: "Rolls-Royce Ghost",
        price: 800000,
        image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.additionalService.createMany({
    data: [
      { hallId: hall6.id, name: "Karnay-Surnay", price: 900000, type: "KARNAY" },
    ],
    skipDuplicates: true,
  });

  // Additional services for hall8
  await prisma.singer.createMany({
    data: [
      {
        hallId: hall8.id,
        name: "Zulfiya Husanova",
        price: 2500000,
        image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400",
      },
      {
        hallId: hall8.id,
        name: "Sardor Mamadaliyev",
        price: 3000000,
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.car.createMany({
    data: [
      {
        hallId: hall8.id,
        brand: "Mercedes-Benz G-Class",
        price: 700000,
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400",
      },
      {
        hallId: hall8.id,
        brand: "Porsche Cayenne",
        price: 600000,
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.menuItem.createMany({
    data: [
      { hallId: hall8.id, name: "Osh (Palov)", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400" },
      { hallId: hall8.id, name: "Kabob", image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400" },
      { hallId: hall8.id, name: "Lagmon", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400" },
    ],
    skipDuplicates: true,
  });

  await prisma.additionalService.createMany({
    data: [
      { hallId: hall8.id, name: "Karnay-Surnay", price: 1000000, type: "KARNAY" },
    ],
    skipDuplicates: true,
  });

  // Bookings
  const bookingDates = [
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
  ];

  const bookingData = [
    { hallId: hall1.id, userId: user1.id, date: bookingDates[0], guestCount: 200, totalPrice: 30000000, advancePayment: 6000000, status: "UPCOMING" as const },
    { hallId: hall1.id, userId: user1.id, date: bookingDates[1], guestCount: 300, totalPrice: 45000000, advancePayment: 9000000, status: "UPCOMING" as const },
    { hallId: hall2.id, userId: user1.id, date: bookingDates[2], guestCount: 150, totalPrice: 18000000, advancePayment: 3600000, status: "UPCOMING" as const },
    { hallId: hall2.id, userId: user1.id, date: bookingDates[3], guestCount: 200, totalPrice: 24000000, advancePayment: 4800000, status: "UPCOMING" as const },
    { hallId: hall3.id, userId: user1.id, date: bookingDates[4], guestCount: 250, totalPrice: 45000000, advancePayment: 9000000, status: "UPCOMING" as const },
    { hallId: hall4.id, userId: user1.id, date: bookingDates[5], guestCount: 400, totalPrice: 80000000, advancePayment: 16000000, status: "UPCOMING" as const },
    { hallId: hall1.id, userId: user1.id, date: bookingDates[6], guestCount: 180, totalPrice: 27000000, advancePayment: 5400000, status: "COMPLETED" as const },
    { hallId: hall2.id, userId: user1.id, date: bookingDates[7], guestCount: 120, totalPrice: 14400000, advancePayment: 2880000, status: "COMPLETED" as const },
    { hallId: hall3.id, userId: user1.id, date: bookingDates[8], guestCount: 100, totalPrice: 18000000, advancePayment: 3600000, status: "CANCELLED" as const },
    { hallId: hall4.id, userId: user1.id, date: bookingDates[9], guestCount: 300, totalPrice: 60000000, advancePayment: 12000000, status: "UPCOMING" as const },
  ];

  for (const booking of bookingData) {
    await prisma.booking.create({ data: { ...booking, selectedServices: [] } });
  }

  console.log("✅ Seed completed!");
  console.log(`Admin: admin@toyxona.uz / Admin1234!`);
  console.log(`Owner1: owner1@toyxona.uz / Owner1234!`);
  console.log(`Owner2: owner2@toyxona.uz / Owner1234!`);
  console.log(`User: user1@gmail.com / User1234!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
