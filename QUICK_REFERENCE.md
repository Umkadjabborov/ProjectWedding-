# 🎯 Quick Reference - Wedding Hall Management System

## Database Status
✅ **Connected:** PostgreSQL (Neon Cloud)  
✅ **URL:** `postgresql://neondb_owner:npg_3hXFiAZfIr1B@ep-nameless-credit-apfxzwvz-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require&connection_limit=2&pgbouncer=true`

---

## 📚 Complete CRUD Endpoints

| Resource | GET | POST | PUT | DELETE | Notes |
|----------|-----|------|-----|--------|-------|
| **Halls** | ✅ List+Filter | ✅ Create | ✅ Update | ✅ Admin | Includes singers, cars, menu |
| **Bookings** | ✅ List+Filter | ✅ Create | ✅ Update | ✅ Cancel | Auto-calculate pricing |
| **Singers** | ✅ List | ✅ Create | ✅ Update | ✅ Delete | Per hall |
| **Cars** | ✅ List | ✅ Create | ✅ Update | ✅ Delete | Per hall |
| **Menu Items** | ✅ List | ✅ Create | ✅ Update | ✅ Delete | Per hall |
| **Services** | ✅ List | ✅ Create | ✅ Update | ✅ Delete | Karnay, Surnay, etc. |
| **Users** | ✅ List (Admin) | ✅ Create (Admin) | ✅ Update | ✅ Delete (Admin) | Role-based |
| **Owners** | ✅ List (Admin) | ✅ Create (Admin) | - | - | Dedicated owner endpoints |

---

## 🔐 Permission Levels

```
ADMIN  → Full access to everything
OWNER  → Manage own halls & services
USER   → Browse & book approved halls
```

---

## 📁 API Structure

```
app/api/
├── halls/
│   ├── route.ts           (GET: list, POST: create)
│   └── [id]/
│       ├── route.ts       (GET: detail, PUT: update, DELETE)
│       ├── approve/       (POST: approve)
│       └── booked-dates/  (GET: dates)
├── bookings/
│   ├── route.ts           (GET: list, POST: create)
│   └── [id]/route.ts      (GET: detail, PUT: update, DELETE: cancel)
├── singers/
│   ├── route.ts           (GET: list, POST: create)
│   └── [id]/route.ts      (GET: detail, PUT: update, DELETE)
├── cars/
│   ├── route.ts           (GET: list, POST: create)
│   └── [id]/route.ts      (GET: detail, PUT: update, DELETE)
├── menu-items/
│   ├── route.ts           (GET: list, POST: create)
│   └── [id]/route.ts      (GET: detail, PUT: update, DELETE)
├── services/
│   ├── route.ts           (GET: list, POST: create)
│   └── [id]/route.ts      (GET: detail, PUT: update, DELETE)
├── users/
│   ├── route.ts           (GET: list, POST: create)
│   └── [id]/route.ts      (GET: detail, PUT: update, DELETE)
├── owners/
│   └── route.ts           (GET: list, POST: create)
├── dashboard/
│   └── stats/route.ts     (GET: statistics)
└── auth/                  (Existing authentication)
```

---

## 🚀 Common Operations

### Create Hall with Services
```bash
POST /api/halls
{
  "name": "Mir To'y Saroyi",
  "capacity": 500,
  "pricePerSeat": 50000,
  "singers": [{"name": "Abdullayev Alim", "price": 1000000, "image": "..."}],
  "cars": [{"brand": "Mercedes", "price": 500000, "image": "..."}],
  "menuItems": [{"name": "Osh", "image": "..."}],
  "karnayPrice": 300000
}
```

### Book a Hall
```bash
POST /api/bookings
{
  "hallId": "abc123",
  "date": "2026-06-15T10:00:00Z",
  "guestCount": 200,
  "selectedServices": [
    {"id": "srv1", "name": "Karnay", "price": 300000}
  ]
}
```

### Update Booking Status
```bash
PUT /api/bookings/[id]
{
  "status": "COMPLETED",
  "guestCount": 220
}
```

---

## 📊 Data Models

### User Roles
- `ADMIN` - Administrator
- `OWNER` - Hall owner
- `USER` - Customer

### Hall Status
- `PENDING` - Awaiting admin approval
- `APPROVED` - Visible to users

### Booking Status
- `UPCOMING` - Future booking
- `COMPLETED` - Past event
- `CANCELLED` - Cancelled booking

### Service Types
- `SINGER` - Singer/musician
- `KARNAY` - Brass band
- `MENU` - Food items
- `CAR` - Transportation

---

## 🔄 Data Relationships

```
User (OWNER/ADMIN)
  ├─> Hall (has many)
       ├─> Singer
       ├─> Car
       ├─> MenuItem
       └─> Booking (has many)
            └─> User (CUSTOMER)

AdditionalService
  └─> Hall
```

---

## 🛠️ Development Commands

```bash
# Generate Prisma Client
npx prisma generate

# View database
npx prisma studio

# Create migration
npx prisma migrate dev --name feature_name

# Reset database (DEV ONLY)
npx prisma migrate reset

# Run dev server
npm run dev

# Build for production
npm run build

# Start production
npm start
```

---

## 📝 Important Notes

1. **Pricing**: Booking total = (guestCount × pricePerSeat) + selectedServices
2. **Advance Payment**: Automatically calculated as 20% of total price
3. **Dates**: All dates are in ISO 8601 format
4. **Images**: Stored as URLs (use Cloudinary for upload)
5. **Authentication**: NextAuth.js handles sessions
6. **Permissions**: Checked on every API endpoint

---

## ✅ Complete Feature List

- ✅ Full CRUD for all resources
- ✅ Advanced filtering and searching
- ✅ Role-based access control
- ✅ Booking management with auto-pricing
- ✅ Multiple service types support
- ✅ Admin dashboard statistics
- ✅ OTP-based email verification
- ✅ Responsive design (UI intact)
- ✅ PostgreSQL integration
- ✅ Error handling & validation

---

## 📞 Support Resources

- **API Documentation:** [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Database Setup:** [DATABASE_SETUP.md](DATABASE_SETUP.md)
- **Schema:** [prisma/schema.prisma](prisma/schema.prisma)
- **Environment:** [.env](.env)
