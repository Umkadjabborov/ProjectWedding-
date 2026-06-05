const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  try {
    console.log('halls', await prisma.hall.count());
    console.log('approved', await prisma.hall.count({ where: { status: 'APPROVED' } }));
    console.log('pending', await prisma.hall.count({ where: { status: 'PENDING' } }));
    console.log('singers', await prisma.singer.count());
    console.log('cars', await prisma.car.count());
    console.log('menuItems', await prisma.menuItem.count());
    console.log('bookings', await prisma.booking.count());
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
})();
