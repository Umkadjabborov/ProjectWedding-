# API Documentation

## Complete CRUD Operations for Wedding Hall Management System

### Base URL
`http://localhost:3000/api`

---

## 1. HALLS (To'yxonalar)

### GET /halls
List all halls with filtering and sorting
- **Query Parameters:**
  - `search`: Search by hall name
  - `district`: Filter by district
  - `status`: Filter by status (PENDING/APPROVED) - admin only
  - `sortBy`: Sort field (default: createdAt)
  - `sortOrder`: asc or desc (default: desc)
- **Returns:** Array of halls

### POST /halls
Create a new hall (OWNER/ADMIN)
- **Body:**
  ```json
  {
    "name": "Zal nomi",
    "images": ["url1", "url2"],
    "district": "Toshkent",
    "address": "Manzil",
    "latitude": 41.123,
    "longitude": 69.456,
    "capacity": 500,
    "pricePerSeat": 50000,
    "phone": "+998901234567",
    "singers": [
      { "name": "Xonanda nomi", "price": 1000000, "image": "url" }
    ],
    "cars": [
      { "brand": "Mercedes", "price": 500000, "image": "url" }
    ],
    "menuItems": [
      { "name": "Osh", "image": "url" }
    ],
    "karnayPrice": 300000
  }
  ```

### GET /halls/[id]
Get specific hall details
- **Returns:** Hall with all related data

### PUT /halls/[id]
Update hall (OWNER/ADMIN)
- **Body:** Same as POST

### DELETE /halls/[id]
Delete hall (ADMIN only)

### GET /halls/[id]/booked-dates
Get booked dates for a hall
- **Returns:** Array of booked dates

### POST /halls/[id]/approve
Approve hall (ADMIN only)

---

## 2. BOOKINGS (Bronlar)

### GET /bookings
List bookings with filtering
- **Query Parameters:**
  - `hallId`: Filter by hall
  - `district`: Filter by district
  - `status`: Filter by status
  - `sortOrder`: asc or desc
- **Returns:** Array of bookings

### POST /bookings
Create new booking (USER/OWNER/ADMIN)
- **Body:**
  ```json
  {
    "hallId": "hall-id",
    "date": "2026-06-15T10:00:00Z",
    "guestCount": 200,
    "selectedServices": [
      { "id": "service-id", "name": "Karnay", "price": 300000 }
    ]
  }
  ```

### GET /bookings/[id]
Get specific booking details

### PUT /bookings/[id]
Update booking (OWNER/ADMIN/BOOKING_USER)
- **Body:**
  ```json
  {
    "date": "2026-06-15T10:00:00Z",
    "guestCount": 250,
    "selectedServices": [],
    "status": "UPCOMING"
  }
  ```

### DELETE /bookings/[id]
Cancel booking (OWNER/ADMIN/BOOKING_USER)

---

## 3. SINGERS (Xonandalar)

### GET /singers
List all singers
- **Query Parameters:**
  - `hallId`: Filter by hall
- **Returns:** Array of singers

### POST /singers
Add singer to hall (OWNER/ADMIN)
- **Body:**
  ```json
  {
    "hallId": "hall-id",
    "name": "Xonanda nomi",
    "price": 1000000,
    "image": "image-url"
  }
  ```

### GET /singers/[id]
Get specific singer details

### PUT /singers/[id]
Update singer (OWNER/ADMIN)
- **Body:**
  ```json
  {
    "name": "Yangi nomi",
    "price": 1200000,
    "image": "new-url"
  }
  ```

### DELETE /singers/[id]
Delete singer (OWNER/ADMIN)

---

## 4. CARS (Mashinalar)

### GET /cars
List all cars
- **Query Parameters:**
  - `hallId`: Filter by hall
- **Returns:** Array of cars

### POST /cars
Add car to hall (OWNER/ADMIN)
- **Body:**
  ```json
  {
    "hallId": "hall-id",
    "brand": "Mercedes",
    "price": 500000,
    "image": "image-url"
  }
  ```

### GET /cars/[id]
Get specific car details

### PUT /cars/[id]
Update car (OWNER/ADMIN)
- **Body:**
  ```json
  {
    "brand": "BMW",
    "price": 600000,
    "image": "new-url"
  }
  ```

### DELETE /cars/[id]
Delete car (OWNER/ADMIN)

---

## 5. MENU ITEMS (Menyu Elementlari)

### GET /menu-items
List all menu items
- **Query Parameters:**
  - `hallId`: Filter by hall
- **Returns:** Array of menu items

### POST /menu-items
Add menu item to hall (OWNER/ADMIN)
- **Body:**
  ```json
  {
    "hallId": "hall-id",
    "name": "Osh",
    "image": "image-url"
  }
  ```

### GET /menu-items/[id]
Get specific menu item details

### PUT /menu-items/[id]
Update menu item (OWNER/ADMIN)
- **Body:**
  ```json
  {
    "name": "Manti",
    "image": "new-url"
  }
  ```

### DELETE /menu-items/[id]
Delete menu item (OWNER/ADMIN)

---

## 6. SERVICES (Xizmatlar - Karnay, Surnay, etc.)

### GET /services
List all additional services
- **Query Parameters:**
  - `hallId`: Filter by hall
  - `type`: Filter by type (SINGER/KARNAY/MENU/CAR)
- **Returns:** Array of services

### POST /services
Add service to hall (OWNER/ADMIN)
- **Body:**
  ```json
  {
    "hallId": "hall-id",
    "name": "Karnay-Surnay",
    "price": 300000,
    "type": "KARNAY"
  }
  ```

### GET /services/[id]
Get specific service details

### PUT /services/[id]
Update service (OWNER/ADMIN)
- **Body:**
  ```json
  {
    "name": "Karnay-Surnay (yangilangan)",
    "price": 350000,
    "type": "KARNAY"
  }
  ```

### DELETE /services/[id]
Delete service (OWNER/ADMIN)

---

## 7. USERS (Foydalanuvchilar)

### GET /users
List all users (ADMIN only)
- **Query Parameters:**
  - `role`: Filter by role (ADMIN/OWNER/USER)
  - `search`: Search by name, email, or username
- **Returns:** Array of users

### POST /users
Create new user (ADMIN only)
- **Body:**
  ```json
  {
    "firstName": "Ism",
    "lastName": "Familiya",
    "email": "email@example.com",
    "username": "username",
    "password": "password",
    "phone": "+998901234567",
    "role": "USER"
  }
  ```

### GET /users/[id]
Get specific user details (ADMIN or self)

### PUT /users/[id]
Update user (ADMIN or self)
- **Body:**
  ```json
  {
    "firstName": "Yangi ism",
    "lastName": "Yangi familiya",
    "phone": "+998901234567",
    "password": "new-password",
    "role": "OWNER"  // Admin only
  }
  ```

### DELETE /users/[id]
Delete user (ADMIN only)

---

## 8. OWNERS (Egalari)

### GET /owners
List all owners (ADMIN only)
- **Returns:** Array of owners with their halls

### POST /owners
Create new owner (ADMIN only)
- **Body:**
  ```json
  {
    "firstName": "Ism",
    "lastName": "Familiya",
    "email": "owner@example.com",
    "username": "ownerusername",
    "password": "password",
    "phone": "+998901234567"
  }
  ```

---

## 9. DASHBOARD (Statistika)

### GET /dashboard/stats
Get dashboard statistics (ADMIN only)
- **Returns:**
  ```json
  {
    "totalHalls": 50,
    "pendingHalls": 5,
    "approvedHalls": 45,
    "totalBookings": 200,
    "upcomingBookings": 100,
    "completedBookings": 80,
    "cancelledBookings": 20,
    "totalOwners": 25,
    "totalUsers": 500,
    "totalRevenue": 5000000
  }
  ```

---

## Error Responses

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

Common HTTP Status Codes:
- `200`: OK
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

---

## Authentication

All endpoints (except auth routes) require authentication via NextAuth.js session.
Include the session in the request header automatically by the browser.

## Roles

- **ADMIN**: Full access to all operations
- **OWNER**: Can manage their own halls and services
- **USER**: Can only create bookings and view approved halls
