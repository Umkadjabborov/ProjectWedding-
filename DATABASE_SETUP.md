# Database Setup Guide

## Project Wedding Hall Management System

### Current Database Configuration

**Database Type:** PostgreSQL (Neon Cloud)  
**ORM:** Prisma  
**Connection:** `postgresql://neondb_owner:npg_3hXFiAZfIr1B@ep-nameless-credit-apfxzwvz-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require&connection_limit=2&pgbouncer=true`

---

## Setup Steps

### 1. Environment Variables
Your `.env` file is already configured with:
```
DATABASE_URL="postgresql://neondb_owner:npg_3hXFiAZfIr1B@ep-nameless-credit-apfxzwvz-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### 2. Initialize Database

#### First Time Setup
```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Apply migrations
npx prisma migrate dev --name init

# Seed database (if seed.ts is available)
npx prisma db seed
```

#### For Existing Database
```bash
# Generate Prisma Client
npx prisma generate

# Apply any pending migrations
npx prisma migrate deploy

# View database in Prisma Studio
npx prisma studio
```

---

## Database Schema

### Models

#### 1. User
- Store all users (ADMIN, OWNER, USER)
- Fields: id, firstName, lastName, email, username, password, phone, role, isVerified, createdAt, updatedAt
- Relations: halls (as owner), bookings, otps

#### 2. OTP
- Email verification codes
- Fields: id, userId, code, expiresAt, used, createdAt
- Expires after 5 minutes

#### 3. Hall
- Wedding halls/venues
- Fields: id, name, images, district, address, latitude, longitude, capacity, pricePerSeat, phone, status, ownerId, createdAt, updatedAt
- Status: PENDING (awaiting approval), APPROVED (visible to users)
- Relations: owner, bookings, services, singers, cars, menuItems

#### 4. AdditionalService
- Services like Karnay, Surnay, etc.
- Fields: id, hallId, name, price, type
- Types: SINGER, KARNAY, MENU, CAR

#### 5. Singer
- Singer/musician for events
- Fields: id, hallId, name, price, image
- Relations: hall

#### 6. Car
- Vehicles for transportation
- Fields: id, hallId, brand, price, image
- Relations: hall

#### 7. MenuItem
- Food items/menu options
- Fields: id, hallId, name, image
- Relations: hall

#### 8. Booking
- Booking reservations
- Fields: id, hallId, userId, date, guestCount, totalPrice, advancePayment, status, selectedServices (JSON), createdAt, updatedAt
- Status: UPCOMING, COMPLETED, CANCELLED
- Advance Payment: 20% of total price

---

## API Endpoints by Resource

### ✅ COMPLETE CRUD OPERATIONS

#### Halls
- ✅ GET /halls (list with filters)
- ✅ POST /halls (create)
- ✅ GET /halls/[id] (retrieve)
- ✅ PUT /halls/[id] (update)
- ✅ DELETE /halls/[id] (delete)
- ✅ Special: /halls/[id]/booked-dates, /halls/[id]/approve

#### Bookings
- ✅ GET /bookings (list with filters)
- ✅ POST /bookings (create)
- ✅ GET /bookings/[id] (retrieve)
- ✅ PUT /bookings/[id] (update)
- ✅ DELETE /bookings/[id] (cancel)

#### Singers
- ✅ GET /singers (list)
- ✅ POST /singers (create)
- ✅ GET /singers/[id] (retrieve)
- ✅ PUT /singers/[id] (update)
- ✅ DELETE /singers/[id] (delete)

#### Cars
- ✅ GET /cars (list)
- ✅ POST /cars (create)
- ✅ GET /cars/[id] (retrieve)
- ✅ PUT /cars/[id] (update)
- ✅ DELETE /cars/[id] (delete)

#### Menu Items
- ✅ GET /menu-items (list)
- ✅ POST /menu-items (create)
- ✅ GET /menu-items/[id] (retrieve)
- ✅ PUT /menu-items/[id] (update)
- ✅ DELETE /menu-items/[id] (delete)

#### Services (Karnay, etc.)
- ✅ GET /services (list)
- ✅ POST /services (create)
- ✅ GET /services/[id] (retrieve)
- ✅ PUT /services/[id] (update)
- ✅ DELETE /services/[id] (delete)

#### Users
- ✅ GET /users (list - admin only)
- ✅ POST /users (create - admin only)
- ✅ GET /users/[id] (retrieve)
- ✅ PUT /users/[id] (update)
- ✅ DELETE /users/[id] (delete - admin only)

#### Owners
- ✅ GET /owners (list - admin only)
- ✅ POST /owners (create - admin only)

#### Dashboard
- ✅ GET /dashboard/stats (statistics)

---

## Permission Model

### ADMIN (Administrator)
- ✅ Access all resources
- ✅ Approve/reject halls
- ✅ Manage users
- ✅ View statistics

### OWNER (Hall Owner)
- ✅ Create and manage own halls
- ✅ Add singers, cars, menu items to own halls
- ✅ View bookings for own halls
- ✅ Update booking status

### USER (Regular User)
- ✅ View approved halls
- ✅ Create bookings
- ✅ View own bookings
- ✅ Cancel own bookings

---

## Testing

### Using Prisma Studio
```bash
npx prisma studio
```

### Sample API Testing
```bash
# Get all halls
curl http://localhost:3000/api/halls

# Create a booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "hallId": "hall-id",
    "date": "2026-06-15T10:00:00Z",
    "guestCount": 200,
    "selectedServices": []
  }'
```

---

## Database Maintenance

### Backup
```bash
# Export data
pg_dump DATABASE_URL > backup.sql
```

### Restore
```bash
# Import data
psql DATABASE_URL < backup.sql
```

### Reset Database (Development Only)
```bash
# Warning: This deletes all data
npx prisma migrate reset
```

---

## Common Issues & Solutions

### Issue: Connection refused
**Solution:** Check DATABASE_URL in .env file and ensure Neon credentials are correct

### Issue: Foreign key constraint failed
**Solution:** Ensure related records exist before creating records

### Issue: Migration conflicts
**Solution:** Run `npx prisma migrate resolve` to fix migration issues

### Issue: Prisma Client out of sync
**Solution:** Run `npx prisma generate` to regenerate client

---

## Next Steps

1. ✅ Database schema is complete
2. ✅ All CRUD endpoints are implemented
3. ✅ Permission-based access control is configured
4. Next: Test all endpoints thoroughly
5. Next: Deploy to production
6. Next: Set up monitoring and logging
