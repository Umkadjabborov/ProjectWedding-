# To'yxona — Wedding Hall Online Booking Platform

A full-stack production-ready wedding hall booking platform built with Next.js 14, TypeScript, Prisma, and NextAuth.js.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS + custom design system
- **State**: Zustand
- **Data Fetching**: TanStack Query v5
- **Forms**: React Hook Form + Zod
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v5 (JWT)
- **Email**: Nodemailer
- **File Upload**: Cloudinary
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret (min 32 chars) |
| `NEXTAUTH_URL` | App URL (http://localhost:3000 for dev) |
| `EMAIL_HOST` | SMTP host (e.g. smtp.gmail.com) |
| `EMAIL_PORT` | SMTP port (587) |
| `EMAIL_USER` | SMTP username / email |
| `EMAIL_PASS` | SMTP password / app password |
| `EMAIL_FROM` | From address |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Public cloud name |

### 3. Set up the database

```bash
# Push schema to database
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed with sample data
npm run db:seed
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Default Credentials (after seeding)

| Role | Email | Password |
|---|---|---|
| Admin | admin@toyxona.uz | Admin1234! |
| Owner 1 | owner1@toyxona.uz | Owner1234! |
| Owner 2 | owner2@toyxona.uz | Owner1234! |
| User | user1@gmail.com | User1234! |

## Routes

| Path | Description | Access |
|---|---|---|
| `/halls` | Hall listing | Public |
| `/halls/[id]` | Hall detail + booking | Public |
| `/my-bookings` | User bookings | USER |
| `/admin/dashboard` | Admin stats | ADMIN |
| `/admin/halls` | Hall management | ADMIN |
| `/admin/bookings` | All bookings | ADMIN |
| `/admin/owners` | Owner management | ADMIN |
| `/admin/approvals` | Pending approvals | ADMIN |
| `/owner/dashboard` | Owner stats | OWNER |
| `/owner/my-hall` | Manage own hall | OWNER |
| `/owner/bookings` | Own hall bookings | OWNER |

## API Endpoints

```
POST   /api/auth/[...nextauth]   NextAuth handler
POST   /api/auth/send-otp        Send OTP email
POST   /api/auth/verify-otp      Verify OTP code
GET    /api/halls                 List halls (with filters)
POST   /api/halls                 Create hall
GET    /api/halls/[id]            Get hall detail
PUT    /api/halls/[id]            Update hall
DELETE /api/halls/[id]            Delete hall
POST   /api/halls/[id]/approve    Approve hall
GET    /api/bookings              List bookings (with filters)
POST   /api/bookings              Create booking
DELETE /api/bookings/[id]         Cancel booking
GET    /api/owners                List owners
POST   /api/owners                Create owner
POST   /api/owners/assign         Assign owner to hall
POST   /api/upload                Upload images to Cloudinary
```

## Features

- JWT authentication with 3 roles (ADMIN, OWNER, USER)
- OTP email verification for owners
- Hall management with image upload
- Interactive booking calendar (color-coded dates)
- Multi-step booking modal with service selection
- Mock payment flow with success toast
- Optimistic UI updates for cancellations
- Dark/light mode
- Fully responsive (mobile-first)
- Data tables with sorting, filtering, pagination
- Tashkent district filtering
